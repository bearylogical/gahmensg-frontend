import { apiURL } from "$lib/utils/constants.js";
export const prerender = 'auto';
/** @type {import('../$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch(apiURL + `/ministries?isMinistry=true`);
    const ministries = await res.json();
    return { ministries };
}