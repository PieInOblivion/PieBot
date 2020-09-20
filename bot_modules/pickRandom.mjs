import { MessageEmbed } from 'discord.js';

export const call = ['pick'];

export function exec(serverProperties) {
	const split = serverProperties.lastMessage.content.split(' ');

	let max = split[1] || 10;
	let min = split[2] || 1;

	if (split.length == 3) {
		[min, max] = [max, min];
	}

	min = Math.ceil(min);
	max = Math.floor(max);

	const res = Math.floor(Math.random() * (max - min + 1) + min);

	serverProperties.lastMessage.channel.send(
		new MessageEmbed()
			.setTitle(`I pick ${res}`)
			.addField('min', min, true)
			.addField('max', max, true)
			.setColor(0x00ffff)
	);
}
