import { fetchData } from "$lib/utils/api";
import { apiURL } from "$lib/utils/constants";
export const prerender = false;

/** @type {import('../$types').PageLoad} */
export async function load() {
    const agencies = await fetchData(`${apiURL}/ministries`);

    // sort by name
    agencies.sort((a, b) => a.name.localeCompare(b.name));

    return { agencies };
}