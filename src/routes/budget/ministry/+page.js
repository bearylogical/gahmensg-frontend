import { apiURL } from "$lib/utils/constants.js";
/** @type {import('../$types').PageLoad} */
export async function load({ fetch }) {
    const agencies = await fetch(apiURL + `/ministries`).then((r) => r.json());

    // sort by name
    agencies.sort((a, b) => a.name.localeCompare(b.name));


    return { agencies };

}