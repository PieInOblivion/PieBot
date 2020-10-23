export async function resetProperties(serverProperties) {
	if (serverProperties.dispatcher != null) {
		await serverProperties.dispatcher.end();
	}

	if (serverProperties.voiceChannel != null) {
		await serverProperties.voiceChannel.disconnect();
	}

	serverProperties.userQueue = [];

	serverProperties.playlistQueue = [];

	serverProperties.playing = null;

	serverProperties.repeat = false;

	serverProperties.voiceChannel = null;

	serverProperties.dispatcher = null;
}