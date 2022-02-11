import { msgSkipFailed, msgSkipped } from '../common_modules/messageResponses.mjs';

export const call = ['skip'];

export function exec(serverProperties) {
	if (!serverProperties.playing || (serverProperties.userQueue.length == 0 && serverProperties.playlistQueue.length == 0)) {
		msgSkipFailed(serverProperties);
		return;
	}

	serverProperties.audioPlayer.stop();
	msgSkipped(serverProperties);
	serverProperties.repeat = false;
}
