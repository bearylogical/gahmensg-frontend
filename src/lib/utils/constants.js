import { dev } from '$app/environment';

let apiURL;

if (dev) {
    apiURL = 'http://localhost:3080/api/v1';
} else {
    apiURL = 'https://gahmen.bearylogical.net/api/v1';
}

export { apiURL };
