import { MessageEmbed } from 'discord.js';

export const call = ['resume'];

export function exec(serverProperties) {
	if (!serverProperties.dispatcher) {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0xff9900).addField('Nice.', `I'm not currently playing anything`)
		);
		return;
	}

	serverProperties.dispatcher.resume();
	serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0x00ffff).setTitle('Resumed'));
}
