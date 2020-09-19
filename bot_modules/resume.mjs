export const call = ['resume'];

export function exec(serverProperties) {

	if (serverProperties.dispatcher) {
		// If audio glitched occur change to .pause(true)
		serverProperties.dispatcher.resume();

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0x00ffff)
			.setTitle('Resumed')
		);

	} else {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0xff9900)
			.addField('Nice.', `I'm not currently playing anything`)
		);

	}

}