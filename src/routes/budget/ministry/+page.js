import { apiURL } from "$lib/utils/constants";
export const prerender = false;

/** @type {import('../$types').PageLoad} */
export async function load({ fetch }) {
    // add a delay to simulate network latency

    const agencies = await fetch(apiURL + `/ministries`).then((r) => r.json());

    // sort by name
    agencies.sort((a, b) => a.name.localeCompare(b.name));


    return { agencies };

}