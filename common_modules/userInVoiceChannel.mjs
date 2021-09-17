export function userInVoiceChannel(serverProperties) {
	return serverProperties.lastMessage.member.voice.channel ? true : false;
}
