import { msgNotPlaying, msgRepeatChange } from '../common_modules/messageResponses.mjs';

export const call = ['repeat'];

export function exec(serverProperties) {
	if (!serverProperties.playing) {
		msgNotPlaying(serverProperties);
		return;
	}

	const command = serverProperties.lastMessage.content.split(' ');

	if (command.length == 2) {
		if (['true', 't', 'yes', 'y', '1'].indexOf(command[1].toLowerCase()) >= 0) {
			serverProperties.repeat = true;
		}

		if (['false', 'f', 'no', 'n', '0'].indexOf(command[1].toLowerCase()) >= 0) {
			serverProperties.repeat = false;
		}
	}

	if (command.length == 1) {
		serverProperties.repeat = !serverProperties.repeat;
	}

	msgRepeatChange(serverProperties);
}