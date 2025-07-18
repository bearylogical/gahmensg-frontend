import { fetchData } from "$lib/utils/api";
import { apiURL } from "$lib/utils/constants";
export const prerender = false;


/** @type {import('../$types').PageLoad} */
export async function load({ }) {
    // const budgetOptsRes = await fetch(apiURL + `/budget/opts`).then((r) => r.json());   
    const budgetOptsRes = await fetchData(`${apiURL}/budget/options`);


    // Consolidate the options by year
    const consolidatedOptions = {};
    budgetOptsRes.forEach((option) => {
        if (!consolidatedOptions[option.value_year]) {
            consolidatedOptions[option.value_year] = [];
        }
        consolidatedOptions[option.value_year].push(option.value_type);
    });

    // order the options
    for (const year in consolidatedOptions) {
        consolidatedOptions[year].sort();
    }
    // convert the object to an array
    const consolidatedOptionsArr = Object.entries(consolidatedOptions).map(([year, options]) => ({ year, options }));
    // sort the array by year
    consolidatedOptionsArr.sort((a, b) => b.year - a.year);
    return { consolidatedOptionsArr };

}