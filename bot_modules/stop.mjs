export const call = ['stop'];

export async function exec(serverProperties) {
	if (serverProperties.dispatcher != null) {
		await serverProperties.dispatcher.end();
	}

	if (serverProperties.voiceChannel != null) {
		await serverProperties.voiceChannel.disconnect();
	}

	resetProperties(serverProperties);
}

export function stopBot(serverProperties) {
	exec(serverProperties);
}

function resetProperties(serverProperties) {
	serverProperties.userQueue = [];

	serverProperties.playlistQueue = [];

	serverProperties.playing = null;

	serverProperties.repeat = false;

	serverProperties.voiceChannel = null;

	serverProperties.dispatcher = null;
}
