import { fetchData } from "./api";
import { apiURLV2, apiURL } from "./constants";

export async function fetchBudgetOverview(selectedYear: string, selectedExpenditure: string) {
    const queryURL =
        `${apiURL}/expenditures?` +
        new URLSearchParams({
            valueType: selectedExpenditure,
            valueYear: selectedYear,
        });
    const res = await fetchData(queryURL);
    return res;
}



export async function fetchProjects(searchQuery: string) {
    const queryURL =
        `${apiURLV2}/projects?`+
        new URLSearchParams({
            query: searchQuery,
        });
    const res = await fetchData(queryURL, {
        method: "POST",
    });

    return res;
}


