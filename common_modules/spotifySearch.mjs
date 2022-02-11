import SpotifyWebApi from 'spotify-web-api-node';
import keysJSON from '../secret/keys.json' assert {type: "json"};
import config from '../secret/config.json' assert {type: "json"};

const spotify = new SpotifyWebApi({
	clientId: keysJSON.spotifyId,
	clientSecret: keysJSON.spotifySecret,
});

async function getAccessToken() {
	await spotify.clientCredentialsGrant().then((data) => {
		spotify.setAccessToken(data.body['access_token']);
	});
}

export function isSpotifyLink(link) {
	return (isTrack(link) || isAlbum(link) || isPlaylist(link));
}

export async function spotifyLinkToArray(link) {
	await getAccessToken();

    switch (true) {
        case isTrack(link):
            return await trackIDtoString(extractID(link));

        case isAlbum(link):
            return await albumIDtoArray(extractID(link));

        case isPlaylist(link):
            return await playlistIDtoArray(extractID(link));
    }
}

export function isTrack(link) {
    return (link.includes(`:track:`) || link.includes(`/track/`));
}

function isAlbum(link) {
    return (link.includes(`:album:`) || link.includes(`/album/`));
}

function isPlaylist(link) {
    return (link.includes(`:playlist:`) || link.includes(`/playlist/`));
}

async function trackIDtoString(id) {
    const result = (await spotify.getTrack(id)).body;

    return `${result.artists.map((artist) => artist.name).join(` `)} - ${result.name}`;
}

async function albumIDtoArray(id) {
    const total = (await spotify.getAlbumTracks(id, { fields: 'total' })).body.total;

	const turns = Math.ceil(total / config.spotifyApiLimit);

	const ret = [];

	for (let i = 0; i < turns; i++) {
		const group = await spotify.getAlbumTracks(id, { offset: config.spotifyApiLimit * i, fields: 'items' });

		group.body.items.forEach((item) => {
			ret.push(`${item.artists.map((artist) => artist.name).join(` `)} - ${item.name}`);
		});
	}

	return ret;
}

async function playlistIDtoArray(id) {
    const total = (await spotify.getPlaylistTracks(id, { fields: 'total' })).body.total;

	const turns = Math.ceil(total / config.spotifyApiLimit);

	const ret = [];

	for (let i = 0; i < turns; i++) {
		const group = await spotify.getPlaylistTracks(id, { offset: config.spotifyApiLimit * i, fields: 'items' });

		group.body.items.forEach((item) => {
			ret.push(`${item.track.artists.map((artist) => artist.name).join(` `)} - ${item.track.name}`);
		});
	}

	return ret;
}

function extractID(link) {
    // If the link is a URI
    if (link.split(`:`).length == 3) return link.split(':').pop();

    // If the link is a URL
    let id = 0;

    const track = link.indexOf(`/track/`);
    const playlist = link.indexOf(`/playlist/`);
    const album = link.indexOf(`/album/`);

    id = track !== -1 ? track + 7 : id;
    id = playlist !== -1 ? playlist + 10 : id;
    id = album !== -1 ? album + 7: id;

    return link.slice(id, id + 22);
}

export function addSearchKey(array) {
	const newArray = [];

	array.forEach((item) => {
		newArray.push(`${config.spotifySearchKey}${item}`);
	});

	return newArray;
}