
import * as d3 from 'd3';

// create a function to retrieve the most recent year data 
export function getMostRecentYearData(data) {
    return data.reduce((acc, curr) => {
        return acc.value_year > curr.value_year ? acc : curr;
    });
}
// create a function to retrieve the percentage difference between the most recent year and the previous year
export function getPercentageDiff(data) {
    let mostRecentYear = getMostRecentYearData(data);
    let previousYear = data.find(
        (d) => d.value_year === mostRecentYear.value_year - 1,
    );
    return (
        ((mostRecentYear.value_amount - previousYear.value_amount) /
            previousYear.value_amount) *
        100
    );
}

// create a function to get the top 5 data by value
export function getTopNData(data, n) {
    // ensure n is an integer minimum 1
    n = Math.max(1, Math.floor(n));
    data.sort((a, b) => b.value_amount - a.value_amount);
    // don't slice if n is -1 or greater than the length of the data
    if (n === -1 || n >= data.length) {
        return data
    } else {
        // sort the data by value_amount and slice the top n
        return data
            .slice(0, n);
    }
}

// create weights for each value_type
const weight = {
    ACTUAL: 1,
    ESTIMATED: 3,
    REVISED: 2,
};
// filter the data such that only the lowest value_type is selected for each year
export function filterData(data) {
    let res = d3.rollups(
        data,
        (v) => d3.min(v, (d) => weight[d.value_type]),
        (d) => d.value_year,
    );
    // use the result to filter the data on the weight
    return data.filter((d) => {
        return (
            res.find((r) => r[0] === d.value_year)[1] ===
            weight[d.value_type]
        );
    });
}

// filter to get the most recent year but do not sum
export function getMostRecentYearDataNoSum(data) {
    return data.filter(
        (d) => d.value_year === getMostRecentYearData(data).value_year,
    );
}


// return up and down arrow based on percentage difference
export function getArrow(val) {
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

export function parseValue(value) {
    return isFinite(value) ? value.toFixed(2) : "--";
}

// depending on the difference, return the color
export function getArrowColor(val) {
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
