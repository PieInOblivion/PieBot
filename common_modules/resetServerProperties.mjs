export async function resetProperties(serverProperties) {
	serverProperties.userQueue = [];

	serverProperties.playlistQueue = [];

	serverProperties.repeat = false;

	if (serverProperties.playing != null) {
		serverProperties.playing = null;
		serverProperties?.voiceConnection.destroy();
		serverProperties?.audioPlayer?.stop(true);
	}

	serverProperties.voiceConnection = null;

	serverProperties.audioPlayer = null;
}