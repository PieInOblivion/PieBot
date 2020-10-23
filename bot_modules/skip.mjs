import { MessageEmbed } from 'discord.js';

export const call = ['skip'];

export function exec(serverProperties) {
	if (
		serverProperties.dispatcher &&
		(serverProperties.userQueue.length != 0 || serverProperties.playlistQueue.length != 0)
	) {
		serverProperties.dispatcher.end();
		serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0x00ffff).setTitle('Skipped'));
		serverProperties.repeat = false;
	} else {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0xff9900).addField('Nice.', 'Only one song in queue or not currently playing')
		);
	}
}
