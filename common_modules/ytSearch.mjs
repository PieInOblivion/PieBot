import YouTubeApi from 'simple-youtube-api';
import keysJSON from '../secret/keys.json';

const youtube = new YouTubeApi(keysJSON.youtube);

export async function youtubeLinkToArray(search) {
	if (isYTUrl(search)) return extractVideoID(search);

	if (isYTUrlShort(search)) return extractShortVideoID(search);

	if (isYTUrlList(search)) return playlistURLToArray(playlistIDtoURL(extractPlaylistID(search)));
}

export async function youtubeIDtoTitle(id) {
	return (await youtube.getVideo(videoIDtoURL(id))).title;
}

export async function youtubeSearchtoID(search) {
	return (await youtube.searchVideos(search, 1))[0].id;
}

export function isYoutubeLink(link) {
	return (isYTUrl(link) || isYTUrlShort(link) || isYTUrlList(link));
}

async function playlistURLToArray(url) {
	const playlist = await youtube.getPlaylist(url);

	const videos = await playlist.getVideos();

	const res = [];

	videos.forEach((item) => {
		res.push(item.id);
	});

	return res;
}

function isYTUrl(testing) {
	// https://www.youtube.com/watch?v=dQw4w9WgXcQ
	const one = testing.includes('youtube.com');

	const two = testing.includes('v=');

	const three = !testing.includes('list=');

	return one && two && three;
}

function isYTUrlShort(testing) {
	// https://youtu.be/dQw4w9WgXcQ
	const one = testing.includes('youtu.be');

	const two = testing.split('/').pop().length == 11;

	return one && two;
}

function isYTUrlList(testing) {
	// https://www.youtube.com/watch?v=VDZEpxheh6E&list=PLBDi8oLoUF39lhHt_81JVuTQZxglGKyIX
	// https://www.youtube.com/watch?list=PLBDi8oLoUF39lhHt_81JVuTQZxglGKyIX&v=VDZEpxheh6E
	const one = testing.includes('youtube.com');

	const two = testing.includes('list=');

	return one && two;
}

function extractVideoID(link) {
	const startPos = link.indexOf('v=');

	return [link.slice(startPos + 2, startPos + 13)];
}

function extractShortVideoID(link) {
	return [link.split('/').pop()];
}

function extractPlaylistID(link) {
	const startPos = link.indexOf('list=');

	return link.slice(startPos + 5, startPos + 39);
}

function playlistIDtoURL(id) {
	// https://www.youtube.com/playlist?list=PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa
	return `https://www.youtube.com/playlist?list=${id}`;
}

function videoIDtoURL(id) {
	// https://www.youtube.com/watch?v=dQw4w9WgXcQ
	return `https://www.youtube.com/watch?v=${id}`;
}
