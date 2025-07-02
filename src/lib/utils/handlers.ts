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
        `${apiURL}/projects?`+
        new URLSearchParams({
            query: searchQuery,
            limit: "100",
            offset: "0",
        });
    const res = await fetchData(queryURL, {
        method: "POST",
    });

    return res;
}

export async function fetchProjectById(projectId: number) {
    const queryURL =
        `${apiURL}/projects?`+
        new URLSearchParams({
            id: projectId.toString(),
            limit: "100",
            offset: "0",
        });
    const res = await fetchData(queryURL, {
        method: "POST",
    });
    return res;
    // return res;
    // const queryURL = `${apiURL}/projects/${projectId}`;
    // const res = await fetchData(queryURL);
    // return res;
}