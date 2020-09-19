export const call = ['pause'];

export function exec(serverProperties) {

	if (serverProperties.dispatcher) {
		// If audio glitched occur change to .pause(true)
		serverProperties.dispatcher.pause();

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0x00ffff)
			.setTitle('Paused')
		);

	} else {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0xff9900)
			.addField('Nice.', `I'm not currently playing anything`)
		);

	}

}