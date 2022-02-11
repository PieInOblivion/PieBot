import { msgNotPlaying, msgQueueStats } from '../common_modules/messageResponses.mjs';

export const call = ['queue'];

export function exec(serverProperties) {
	if (!serverProperties.playing) {
		msgNotPlaying(serverProperties);
		return;
	}

	msgQueueStats(serverProperties);
}
