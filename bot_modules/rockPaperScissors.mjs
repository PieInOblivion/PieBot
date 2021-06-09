import { MessageEmbed } from 'discord.js';
import { ObjToFile } from '../common_modules/objToFile.mjs';

export const call = ['rock', 'paper', 'scissors'];

const rpsScoresLoc = '../secret/rps.json';

const scores = import(rpsScoresLoc);

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
		ObjToFile(rpsScoresLoc, scores);
	} else if (
		(serverProperties.lastMessage.content === 'rock' && botPick === 'scissors') ||
		(serverProperties.lastMessage.content === 'paper' && botPick === 'rock') ||
		(serverProperties.lastMessage.content === 'scissors' && botPick === 'paper')
	) {
		returnTitle = 'You Won!';
		scores.userScore++;
		ObjToFile(rpsScoresLoc, scores);
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
