import { msgNotPlaying, msgPaused } from '../common_modules/messageResponses.mjs';

export const call = ['pause'];

export function exec(serverProperties) {
	if (!serverProperties.playing) {
		msgNotPlaying(serverProperties);
		return;
	}

	serverProperties.audioPlayer.pause();
	msgPaused(serverProperties);
}
