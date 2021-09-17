export async function resetProperties(serverProperties) {
	if (serverProperties.playing != null) {
		serverProperties.playing = null;
		serverProperties?.voiceConnection.destroy();
		serverProperties?.audioPlayer.stop(true);
	}

	serverProperties.userQueue = [];

	serverProperties.playlistQueue = [];

	serverProperties.repeat = false;

	serverProperties.voiceConnection = null;

	serverProperties.audioPlayer = null;
}