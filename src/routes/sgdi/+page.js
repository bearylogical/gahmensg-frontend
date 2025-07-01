import { fetchData } from "$lib/utils/api";
export const prerender = false;


/** @type {import('../$types').PageLoad} */
export async function load() {
    const ministries = await fetchData(`/ministries?isMinistry=true`);
    return { ministries };
}