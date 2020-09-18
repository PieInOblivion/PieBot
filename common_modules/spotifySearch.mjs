import SpotifyWebApi from 'spotify-web-api-node';
import keysJSON from '../secret/keys.json';

const spotify = new SpotifyWebApi({
  clientId: keysJSON.spotifyId,
  clientSecret: keysJSON.spotifySecret
});

export async function spotifyURItoArray(search) {
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
	spotifyApi.getPlaylist(id)
	.then(function(data) {
		console.log('Some information about this playlist', data.body);
	}, function(err) {
		console.log('Something went wrong!', err);
	});
}

async function albumIDtoArr(id) {
	spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })
		.then(function(data) {
			console.log(data.body);
		}, function(err) {
			console.log('Something went wrong!', err);
		});
}