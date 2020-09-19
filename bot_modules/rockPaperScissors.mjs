import { writeFile } from 'fs';
import { conLog } from '../common_modules/conLog.mjs';
import { MessageEmbed } from 'discord.js';

export const call = ['rock', 'paper', 'scissors'];

import scores from '../secret/rps.json';

function updateSave(obj) {
	writeFile('./data/rps.json', JSON.stringify(obj), function writeJSON(err) {
		if (err) return conLog(err, 'ERROR');
	});
}

export function exec(serverProperties) {

	const item = call[Math.floor(Math.random() * 3)];

	let returnTitle = '';

	if ((serverProperties.lastMessage.content === 'rock' && item === 'paper') || (serverProperties.lastMessage.content === 'paper' && item === 'scissors') || (serverProperties.lastMessage.content === 'scissors' && item === 'rock')) {
	
		returnTitle= 'I Won!';
		scores.botScore++;
		updateSave(scores);

	} else if ((serverProperties.lastMessage.content === 'rock' && item === 'scissors') || (serverProperties.lastMessage.content === 'paper' && item === 'rock') || (serverProperties.lastMessage.content === 'scissors' && item === 'paper')) {
		
		returnTitle = 'You Won!';
		scores.userScore++;
		updateSave(scores);

	} else {

		returnTitle = 'We Tied!';

	}

	conLog(`R: ${returnTitle} / C(B-U): ${item}-${serverProperties.lastMessage.content} / S(B-U): ${scores.botScore}-${scores.userScore}`);

	serverProperties.lastMessage.channel.send(new MessageEmbed()	
		.setTitle(returnTitle)
		.setAuthor('Scoreboard')
		.setColor(0x00ffff)
		.addField('Bot', scores.botScore, true)
		.addField('Users', scores.userScore, true)
	);
	
}