import { apiURL, apiURLV2 } from "./constants";


export async function fetchBudgetOverview(selectedYear: string, selectedExpenditure: string) {
    const queryURL =
        apiURL +
        "/budget?" +
        new URLSearchParams({
            valueType: selectedExpenditure,
            valueYear: selectedYear,
        });
    const res = await fetch(queryURL).then((res) => res.json());
    return res;
}



export async function fetchProjects(searchQuery: string) {
    const queryURL =
        apiURLV2 +
        "/projects?" +
        new URLSearchParams({
            query: searchQuery,
        });
    const res = await fetch(queryURL, {
        method: "POST",
    }).then((res) => res.json());
    return res;
}

