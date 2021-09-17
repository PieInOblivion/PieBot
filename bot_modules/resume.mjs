import { MessageEmbed } from 'discord.js';

export const call = ['resume'];

export function exec(serverProperties) {
	if (!serverProperties.playing) {
		serverProperties.lastMessage.channel.send({ embeds: [
			new MessageEmbed().setColor(0xff9900).addField('Nice.', `I'm not currently playing anything`)
		]});
		return;
	}

	serverProperties.audioPlayer.unpause();
	serverProperties.lastMessage.channel.send({ embeds: [
		new MessageEmbed().setColor(0x00ffff).setTitle('Resumed')
	]});
}
