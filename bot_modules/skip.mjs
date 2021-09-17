import { MessageEmbed } from 'discord.js';

export const call = ['skip'];

export function exec(serverProperties) {
	if (!serverProperties.playing || (serverProperties.userQueue.length == 0 && serverProperties.playlistQueue.length == 0)) {
		serverProperties.lastMessage.channel.send({ embeds: [
			new MessageEmbed().setColor(0xff9900).addField('Nice.', 'Only one song in queue or not currently playing')
		]});
		return;
	}

	serverProperties.audioPlayer.stop();
	serverProperties.lastMessage.channel.send({ embeds: [
		new MessageEmbed().setColor(0x00ffff).setTitle('Skipped')
	]});
	serverProperties.repeat = false;
}
