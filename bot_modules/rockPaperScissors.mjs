import { writeFile } from 'fs';
import { MessageEmbed } from 'discord.js';

export const call = ['rock', 'paper', 'scissors'];

import scores from '../secret/rps.json';

function updateSave(obj) {
	writeFile('./secret/rps.json', JSON.stringify(obj), function writeJSON(err) {
		if (err) return console.log(err);
	});
}

export function exec(serverProperties) {
	const botPick = call[Math.floor(Math.random() * 3)];

	let returnTitle = '';

	if (
		(serverProperties.lastMessage.content === 'rock' && botPick === 'paper') ||
		(serverProperties.lastMessage.content === 'paper' && botPick === 'scissors') ||
		(serverProperties.lastMessage.content === 'scissors' && botPick === 'rock')
	) {
		returnTitle = 'I Won!';
		scores.botScore++;
		updateSave(scores);
	} else if (
		(serverProperties.lastMessage.content === 'rock' && botPick === 'scissors') ||
		(serverProperties.lastMessage.content === 'paper' && botPick === 'rock') ||
		(serverProperties.lastMessage.content === 'scissors' && botPick === 'paper')
	) {
		returnTitle = 'You Won!';
		scores.userScore++;
		updateSave(scores);
	} else {
		returnTitle = 'We Tied!';
	}

	serverProperties.lastMessage.channel.send(
		new MessageEmbed()
			.setTitle(returnTitle)
			.setAuthor('Scoreboard')
			.setColor(0x00ffff)
			.addField('Bot', scores.botScore, true)
			.addField('Users', scores.userScore, true)
	);
}
