
import * as d3 from 'd3';

const apiURL = 'http://localhost:3080';

// create a function to load html data from an external url and parse a specific className
export const loadMinistryDescription = async (url, className = 'agency-description') => {
	const response = await fetch(url);
	const html = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const element = doc.getElementsByClassName(className)[0];
	return element;
};

export const loadCsv = async (filename) => {
	const data = await d3.csv(`/data/${filename}.csv`);
	return data;
};

export async function fetchMinistries() {
	const response = await fetch(apiURL + '/ministry');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	else {
		const data = await response.json();
		const resultKV = {};
		data.forEach((ministry) => {
			resultKV[ministry.name] = ministry.id;
		})
		return resultKV;
	}
}


export async function fetchMinistryLinks(id) {

	const response = await fetch(apiURL + `/ministry/${id}/sgdi/links`);
	const data = await response.json();
	const processedData = processData(data);
	return processedData;
}

export async function fetchMinistryProjects(id) {
	const response = await fetch(apiURL + `/ministry/${id}/budget/projects`);
	const data = await response.json();
	return data;
}

// create a function to load data from loadCsv and parse it into a d3 grouped object
export const loadAndProcessData = async (filename) => {
	const data = await loadCsv(filename);
	const processedData = processData(data);
	return processedData;
};

// create a function to process the data into a d3 grouped object
export const processData = (data) => {
	// const filterData = data.filter(d => d.parent !== d.child);
	const groupedData = d3
		.stratify()
		.id((d) => d.child_url)
		.parentId((d) => d.parent_url)(data);
	// const groupedData = d3.hierarchy(data, (d) => d.child);
	// match each id with the corresponding data
	return groupedData;
};
