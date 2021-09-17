import { MessageEmbed } from 'discord.js';

export const call = ['pause'];

export function exec(serverProperties) {
	if (!serverProperties.playing) {
		serverProperties.lastMessage.channel.send({ embeds: [
			new MessageEmbed().setColor(0xff9900).addField('Nice.', `I'm not currently playing anything`)
		]});
		return;
	}

	serverProperties.audioPlayer.pause();
	serverProperties.lastMessage.channel.send({ embeds: [
		new MessageEmbed().setColor(0x00ffff).setTitle('Paused')
	]});
}
