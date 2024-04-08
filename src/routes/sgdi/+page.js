import { apiURL } from "$lib/utils/constants.js";

/** @type {import('../$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiURL + `/ministries?isMinistry=true`);
    const ministries = await res.json();
    console.log(ministries);
    return { ministries };
}