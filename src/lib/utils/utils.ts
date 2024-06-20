import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
] as const;

const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
});

export function formatTimeAgo(date: Date) {
    let duration = (date.getTime() - new Date().getTime()) / 1000;

    for (let i = 0; i <= DIVISIONS.length; i++) {
        const division = DIVISIONS[i];
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name);
        }
        duration /= division.amount;
    }
}