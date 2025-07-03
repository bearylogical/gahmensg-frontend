import * as d3 from "d3";
import type { ProjectRecord } from "$lib/stores/projectStore";

// create a function to retrieve the most recent year data
export function getMostRecentYearData(
  data: ProjectRecord[]
): ProjectRecord | undefined {
  if (data.length === 0) {
    return undefined;
  }
  return data.reduce((acc: ProjectRecord, curr: ProjectRecord) => {
    return (acc.value_year || 0) > (curr.value_year || 0) ? acc : curr;
  });
}
// create a function to retrieve the percentage difference between the most recent year and the previous year
export function getPercentageDiff(data: ProjectRecord[]): number {
  let mostRecentYear = getMostRecentYearData(data);
  if (!mostRecentYear || mostRecentYear.value_year === undefined) {
    return 0;
  }
  let previousYear = data.find(
    (d: ProjectRecord) => d.value_year === mostRecentYear.value_year - 1
  );
  if (
    !previousYear ||
    previousYear.value_amount === undefined ||
    mostRecentYear.value_amount === undefined
  ) {
    return 0;
  }
  return (
    ((mostRecentYear.value_amount - previousYear.value_amount) /
      previousYear.value_amount) *
    100
  );
}

// create a function to get the top 5 data by value
export function getTopNData(data: ProjectRecord[], n: number): ProjectRecord[] {
  // ensure n is an integer minimum 1
  n = Math.max(1, Math.floor(n));
  data.sort(
    (a: ProjectRecord, b: ProjectRecord) =>
      (b.value_amount || 0) - (a.value_amount || 0)
  );
  // don't slice if n is -1 or greater than the length of the data
  if (n === -1 || n >= data.length) {
    return data;
  } else {
    // sort the data by value_amount and slice the top n
    return data.slice(0, n);
  }
}

// create weights for each value_type
const weight = {
  ACTUAL: 1,
  ESTIMATED: 3,
  REVISED: 2,
};
// filter the data such that only the lowest value_type is selected for each year
export function filterData(data: ProjectRecord[]): ProjectRecord[] {
  let res = d3.rollups(
    data,
    (v: ProjectRecord[]) =>
      d3.min(
        v,
        (d: ProjectRecord) => weight[d.value_type as keyof typeof weight]
      ),
    (d: ProjectRecord) => d.value_year
  );
  // use the result to filter the data on the weight
  return data.filter((d: ProjectRecord) => {
    const found = res.find(
      (r: [number | undefined, number | undefined]) => r[0] === d.value_year
    );
    return found && found[1] === weight[d.value_type as keyof typeof weight];
  });
}

// filter to get the most recent year but do not sum
export function getMostRecentYearDataNoSum(
  data: ProjectRecord[],
  selectedYear?: number
): ProjectRecord[] {
  return data.filter((d: ProjectRecord) => d.value_year === selectedYear);
}

// return up and down arrow based on percentage difference
export function getArrow(val: number): string {
  if (val > 0) {
    return "↑";
  } else if (val < 0) {
    return "↓";
  } else if (!isFinite(val)) {
    return "";
  } else {
    return "";
  }
}

export function parseValue(value: number): string {
  return isFinite(value) ? value.toFixed(2) : "--";
}

// depending on the difference, return the color
export function getArrowColor(val: number): string {
  if (!isFinite(val)) {
    return "text-gray-500";
  }
  if (val > 0) {
    return "text-green-500";
  } else if (val < 0) {
    return "text-red-500";
  } else {
    return "text-gray-500";
  }
}
