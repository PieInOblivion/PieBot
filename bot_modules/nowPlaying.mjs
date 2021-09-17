import { MessageEmbed } from 'discord.js';
import { youtubeIDtoTitle } from '../common_modules/ytSearch.mjs';

export const call = ['np'];

export async function exec(serverProperties) {
	if (!serverProperties.playing) {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0xff9900).addField('Nice.', `I'm not currently playing anything`)
		);
		return;
	}

	const title = await youtubeIDtoTitle(serverProperties.playing);

	serverProperties.lastMessage.channel.send({ embeds: [
		new MessageEmbed()
			.setColor(0x00ffff)
			.setTitle('Now Playing: ')
			.addField(title, `**https://www.youtube.com/watch?v=${serverProperties.playing}**`)
			.addField(`Repeat:`, (serverProperties.repeat ? 'Yes' : 'No'), true)
	]});
}