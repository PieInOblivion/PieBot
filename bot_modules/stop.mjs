export const call = ['stop'];

export async function exec(serverProperties) {

	try {
		await serverProperties.dispatcher.end();
		await serverProperties.voiceChannel.disconnect();
		resetProperties(serverProperties);
	} catch(err) {
		resetProperties(serverProperties);
	}

}

export function stopBot(serverProperties) {
	exec(serverProperties);
}

function resetProperties(serverProperties) {
	serverProperties.userQueue = [];
	serverProperties.playlistQueue = [];
	serverProperties.playing = null;
	serverProperties.voiceChannel = null;
	serverProperties.dispatcher = null;
}