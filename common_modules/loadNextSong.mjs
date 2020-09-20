import { youtubeSearchtoID } from './ytSearch.mjs';
import config from '../secret/config.json';

export async function loadNextSong(serverProperties) {
	if (serverProperties.userQueue.length > 0) {
		serverProperties.playing = serverProperties.userQueue[0];

		serverProperties.userQueue.shift();

		return true;
	} else if (serverProperties.playlistQueue.length > 0) {
		if (serverProperties.playlistQueue[0].startsWith(config.spotifySearchKey)) {
			serverProperties.playing = await youtubeSearchtoID(
				serverProperties.playlistQueue[0].replace(config.spotifySearchKey, '')
			);
		} else {
			serverProperties.playing = serverProperties.playlistQueue[0];
		}

		serverProperties.playlistQueue.shift();

		return true;
	}

	return false;
}
