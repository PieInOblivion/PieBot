import { msgYouTubeSearchFailed } from './messageResponses.mjs';
import { youtubeSearchtoID } from './ytSearch.mjs';
import config from '../secret/config.json' assert {type: "json"};

export async function loadNextSong(serverProperties) {
	if (serverProperties.repeat) return true;

	if (serverProperties.userQueue.length > 0) {
		serverProperties.playing = serverProperties.userQueue[0];

		serverProperties.userQueue.shift();

		return true;
	} else if (serverProperties.playlistQueue.length > 0) {
		if (serverProperties.playlistQueue[0].startsWith(config.spotifySearchKey)) {
			const searchArg = serverProperties.playlistQueue[0].replace(config.spotifySearchKey, '');
			serverProperties.playing = await youtubeSearchtoID(searchArg);
			if (!serverProperties.playing) {
				msgYouTubeSearchFailed(serverProperties, searchArg);
				serverProperties.playlistQueue.shift();
				return loadNextSong(serverProperties);
			}
		} else {
			serverProperties.playing = serverProperties.playlistQueue[0];
		}

		serverProperties.playlistQueue.shift();

		return true;
	}

	return false;
}
