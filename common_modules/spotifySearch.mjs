import SpotifyWebApi from 'spotify-web-api-node';
import keysJSON from '../secret/keys.json';

const spotify = new SpotifyWebApi({
  clientId: keysJSON.spotifyId,
  clientSecret: keysJSON.spotifySecret
});

const limit = 100;

export async function spotifyURItoArray(search) {
	await getAccessToken();

	const id = extractID(search);

	if (isSpotifyPlaylist(search)) return playlistIDtoArr(id);

	if (isSpotifyAlbum(search)) return albumIDtoArr(id);
}

function isSpotifyPlaylist(search) {
	// spotify:playlist:1vTd1NZxTCIJ851CvRohv7
	const one = search.includes('spotify:playlist:');
	const two = search.length == 39;
	return (one && two);
}

function isSpotifyAlbum(search) {
	// spotify:album:7xV2TzoaVc0ycW7fwBwAml
	const one = search.includes('spotify:album:');
	const two = search.length == 36;
	return (one && two);
}

function extractID(link) {
	return link.split(':').pop();
}

async function playlistIDtoArr(id) {
	const total = (await spotify.getPlaylistTracks(id, { fields: 'total' })).body.total;

	const turns = Math.ceil(total / limit);
	const ret = [];

	for (let i = 0; i < turns; i++) {
		const group = await spotify.getPlaylistTracks(id, { offset: limit*i, fields: 'items' });
		group.body.items.forEach(item => {
			ret.push(`${item.track.artists.map(artist => artist.name).join(` `)} - ${item.track.name}`);
		});
	}
	
	return ret;
}

async function albumIDtoArr(id) {
	const total = (await spotify.getAlbumTracks(id, { fields: 'total' })).body.total;

	const turns = Math.ceil(total / limit);
	const ret = [];

	for (let i = 0; i < turns; i++) {
		const group = await spotify.getAlbumTracks(id, { offset: limit*i, fields: 'items' });
		group.body.items.forEach(item => {
			ret.push(`${item.artists.map(artist => artist.name).join(` `)} - ${item.name}`);
		});
	}
	
	return ret;
}

async function getAccessToken() {
	await spotify.clientCredentialsGrant().then(data => {
		spotify.setAccessToken(data.body['access_token']);
	});
}