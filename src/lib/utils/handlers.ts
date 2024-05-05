import { apiURL } from "./constants";


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

