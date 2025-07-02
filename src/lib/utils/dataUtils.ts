
import * as d3 from 'd3';
import type { HierarchyNode } from 'd3';
import { fetchData } from './api';
import { apiURL, apiURLV2 } from './constants';

// create a function to load html data from an external url and parse a specific className
import type { ProjectRecord } from "$lib/stores/projectStore";

interface LinkDatum extends d3.DSVRowString {
    child_url: string;
    parent_url: string;
}

export const loadMinistryDescription = async (url: string, className: string = 'agency-description'): Promise<Element | null> => {
	const response = await fetch(url);
	const html = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const element = doc.getElementsByClassName(className)[0];
	return element;
};

export const loadCsv = async (filename: string): Promise<d3.DSVRowArray<string>> => {
	const data = await d3.csv(`/data/${filename}.csv`);
	return data;
};

export async function fetchMinistries(): Promise<{[key: string]: number}> {
	const data = await fetchData(`${apiURLV2}/ministry`);
	const resultKV: {[key: string]: number} = {};
	data.forEach((ministry: {name: string, id: number}) => {
		resultKV[ministry.name] = ministry.id;
	})
	return resultKV;
}


export async function fetchMinistryLinks(id: number): Promise<HierarchyNode<LinkDatum>> {

	const data: LinkDatum[] = await fetchData(`/ministry/${id}/sgdi/links`);
	const processedData = processData(data);
	return processedData;
}

export async function fetchMinistryProjects(id: number): Promise<ProjectRecord[]> {
	const data = await fetchData(`/ministry/${id}/budget/projects`);
	return data;
}

// create a function to load data from loadCsv and parse it into a d3 grouped object
export const loadAndProcessData = async (filename: string): Promise<HierarchyNode<LinkDatum>> => {
	const data = await loadCsv(filename);
	const processedData = processData(data.map((d: d3.DSVRowString) => ({
		child_url: d.child_url || '',
		parent_url: d.parent_url || '',
	})) as LinkDatum[]);
	return processedData;
};

// create a function to process the data into a d3 grouped object
export const processData = (data: LinkDatum[]): HierarchyNode<LinkDatum> => {
	const groupedData = d3
		.stratify<LinkDatum>()
		.id((d: LinkDatum) => d.child_url)
		.parentId((d: LinkDatum) => d.parent_url)(data as LinkDatum[]);
	return groupedData;
};

export const getMostRecentYearData = (data: ProjectRecord[]): ProjectRecord | undefined => {
	if (data.length === 0) {
		return undefined;
	}
	return data.reduce((acc, curr) => {
		return (acc.value_year || 0) > (curr.value_year || 0) ? acc : curr;
	});
}

const weight = {
	ACTUAL: 1,
	ESTIMATED: 3,
	REVISED: 2,
};

// filter the data such that only the lowest value_type is selected for each year
export const filterData = (data: ProjectRecord[]): ProjectRecord[] => {
	let res = d3.rollups(
		data,
		(v: ProjectRecord[]) => d3.min(v, (d: ProjectRecord) => weight[d.value_type as keyof typeof weight]),
		(d: ProjectRecord) => d.value_year,
	);
	// use the result to filter the data on the weight
	return data.filter((d: ProjectRecord) => {
		const found = res.find((r): r is [number | undefined, number | undefined] => r[0] === d.value_year);
		return (
			found && found[1] === weight[d.value_type as keyof typeof weight]
		);
	})
}