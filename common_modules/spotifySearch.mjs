import SpotifyWebApi from 'spotify-web-api-node';
import keysJSON from '../secret/keys.json';
import config from '../secret/config.json';

const spotify = new SpotifyWebApi({
	clientId: keysJSON.spotifyId,
	clientSecret: keysJSON.spotifySecret,
});

export async function spotifyURItoArray(search) {
	await getAccessToken();

	const id = extractID(search);

	if (isSpotifyPlaylist(search)) return await playlistIDtoArr(id);

	if (isSpotifyAlbum(search)) return await albumIDtoArr(id);
}

export function addSearchKey(array) {
	const newArray = [];

	array.forEach((item) => {
		newArray.push(`${config.spotifySearchKey}${item}`);
	});

	return newArray;
}

function isSpotifyPlaylist(search) {
	// spotify:playlist:1vTd1NZxTCIJ851CvRohv7
	return search.includes('spotify:playlist:');
}

function isSpotifyAlbum(search) {
	// spotify:album:7xV2TzoaVc0ycW7fwBwAml
	return search.includes('spotify:album:');
}

function extractID(link) {
	return link.split(':').pop();
}

async function playlistIDtoArr(id) {
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

async function albumIDtoArr(id) {
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

async function getAccessToken() {
	await spotify.clientCredentialsGrant().then((data) => {
		spotify.setAccessToken(data.body['access_token']);
	});
}
