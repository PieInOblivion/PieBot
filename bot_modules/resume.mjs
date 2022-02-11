import { msgNotPlaying, msgResumed } from '../common_modules/messageResponses.mjs';

export const call = ['resume'];

export function exec(serverProperties) {
	if (!serverProperties.playing) {
		msgNotPlaying(serverProperties);
		return;
	}

	serverProperties.audioPlayer.unpause();
	msgResumed(serverProperties);
}
