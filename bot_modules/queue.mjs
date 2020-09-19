import { MessageEmbed } from 'discord.js';

export const call = ['queue'];

export function exec(serverProperties) {

	if (serverProperties.dispatcher) {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setTitle(`Queue Stats`)
			.setAuthor(`Playing: https://www.youtube.com/watch?v=${serverProperties.playing}`)
			.addField(`User Queue:`, serverProperties.userQueue.length, true)
			.addField(`Playlist Queue:`, serverProperties.playlistQueue.length, true)
			.setColor(0x00ffff)
		);

	} else {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0xff9900)
			.addField('Nice.', `I'm not currently playing anything`)
		);

	}

}