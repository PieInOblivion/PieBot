import { MessageEmbed } from 'discord.js';

export const call = ['remove'];

export function exec(serverProperties) {
	if (serverProperties.dispatcher && serverProperties.userQueue.length > 0) {
		serverProperties.userQueue.pop();

		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0x00ffff).setTitle('Remove last song added to user queue')
		);
	} else {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0xff9900).addField('Nice.', `No songs in user queue to remove`)
		);
	}
}
