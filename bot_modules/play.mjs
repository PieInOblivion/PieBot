import {
	msgNotInVoiceChannel,
	msgPlayAddedSong,
	msgPlayNowPlaying,
	msgPlayQueueStats
} from '../common_modules/messageResponses.mjs';
import { youtubeLinkToArray, youtubeSearchtoID, youtubeIDtoTitle, isYoutubeLink } from '../common_modules/ytSearch.mjs';
import { spotifyLinkToArray, addSearchKey, isSpotifyLink, isTrack } from '../common_modules/spotifySearch.mjs';
import { shuffle } from '../common_modules/arrayShuffle.mjs';
import { audioEvent } from '../common_modules/audioEvent.mjs';
import { userInVoiceChannel } from '../common_modules/userInVoiceChannel.mjs';
import { removePrefix } from '../common_modules/removePrefix.mjs';

export const call = ['play ', 'Play ', 'PLAY ', 'p ', 'P '];

export async function exec(serverProperties) {
	if (!userInVoiceChannel(serverProperties)) {
		msgNotInVoiceChannel(serverProperties);
		return;
	}

	const searchArg = removePrefix(serverProperties.lastMessage.content);

	switch (true) {
		case isYoutubeLink(searchArg):
			const youtubeResult = await youtubeLinkToArray(searchArg);
			if (youtubeResult.length == 1) {
				serverProperties.userQueue.push(youtubeResult[0]);
				userQueueMessage(serverProperties, youtubeResult[0]);
			} else {
				serverProperties.playlistQueue.push(...shuffle(youtubeResult));
				playlistQueueMessage(serverProperties, youtubeResult.length);
			}
			break;

		case isSpotifyLink(searchArg):
			const spotifyResult = await spotifyLinkToArray(searchArg);
			if (isTrack(searchArg)) {
				const youtubeResult = await youtubeSearchtoID(spotifyResult);
				serverProperties.userQueue.push(youtubeResult);
				userQueueMessage(serverProperties, youtubeResult);
			} else {
				serverProperties.playlistQueue.push(...shuffle(addSearchKey(spotifyResult)));
				playlistQueueMessage(serverProperties, spotifyResult.length);
			}
			break;

		default:
			const searchResult = await youtubeSearchtoID(searchArg);
			serverProperties.userQueue.push(searchResult);
			userQueueMessage(serverProperties, searchResult);
	}

	audioEvent(serverProperties);
}

async function playlistQueueMessage(serverProperties, addedPlaylistSongsLength) {
	msgPlayQueueStats(serverProperties, addedPlaylistSongsLength);
}

async function userQueueMessage(serverProperties, IDAdded) {
	const title = await youtubeIDtoTitle(IDAdded);

	if (serverProperties.userQueue.length === 0) {
		msgPlayNowPlaying(serverProperties, title, IDAdded);
	} else {
		msgPlayAddedSong(serverProperties, title, IDAdded);
	}
}
