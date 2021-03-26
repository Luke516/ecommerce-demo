import axios from 'axios';

const serverBaseUrl = 'http://140.114.85.27:8087/api';

export function getCaptcha() {
    let url = "https://11rp38z9gg.execute-api.us-west-2.amazonaws.com/20210315";

    console.log(`Making GET request to: ${url}`);

    return fetch(url).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.data;
    });
}
