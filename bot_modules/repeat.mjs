import { MessageEmbed } from 'discord.js';

export const call = ['repeat'];

export function exec(serverProperties) {
	if (!serverProperties.dispatcher) {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0xff9900).addField('Nice.', `I'm not currently playing anything`)
		);
		return;
	}

	const command = serverProperties.lastMessage.content.split(' ');

	if (command.length == 2) {
		if (['true', 't', 'yes', 'y', '1'].indexOf(command[1].toLowerCase()) >= 0) {
			serverProperties.repeat = true;
		}

		if (['false', 'f', 'no', 'n', '0'].indexOf(command[1].toLowerCase()) >= 0) {
			serverProperties.repeat = false;
		}
	}

	if (command.length == 1) {
		serverProperties.repeat = !serverProperties.repeat;
	}

	serverProperties.lastMessage.channel.send(
		new MessageEmbed()
			.setColor(0x00ffff)
			.addField('Repeat:', (serverProperties.repeat ? 'Yes' : 'No'))
	);
}