import { msgRemoveLastSong, msgRemoveNoSongs } from '../common_modules/messageResponses.mjs';

export const call = ['remove'];

export function exec(serverProperties) {
	if (!serverProperties.playing || serverProperties.userQueue.length == 0) {
		msgRemoveNoSongs(serverProperties);
		return;
	}

	serverProperties.userQueue.pop();

	msgRemoveLastSong(serverProperties);
}