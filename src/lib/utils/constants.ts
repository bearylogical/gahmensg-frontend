import { dev } from '$app/environment';

let apiURL: string;
let apiURLV2: string;

if (dev) {
    apiURL = 'http://localhost:3080/api/v1';
    apiURLV2 = 'http://localhost:3080/api/v2';
} else {
    apiURL = 'https://gahmen.bearylogical.net/api/v1';
    apiURLV2 = 'https://gahmen.bearylogical.net/api/v2';
}

export { apiURL, apiURLV2 };
