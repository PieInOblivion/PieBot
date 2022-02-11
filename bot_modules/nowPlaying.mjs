import { msgNotPlaying, msgNowPlaying } from '../common_modules/messageResponses.mjs';
import { youtubeIDtoTitle } from '../common_modules/ytSearch.mjs';

export const call = ['np'];

export async function exec(serverProperties) {
	if (!serverProperties.playing) {
		msgNotPlaying(serverProperties);
		return;
	}

	const title = await youtubeIDtoTitle(serverProperties.playing);

	msgNowPlaying(serverProperties, title);
}