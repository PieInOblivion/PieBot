import got from 'got';

export async function getJSON(url) {
    return await got.get(url).json();
}

export async function getHTML(url) {
    return await got.post(url);
}