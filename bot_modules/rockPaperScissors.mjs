import { msgRPSResult } from '../common_modules/messageResponses.mjs';
import { rpsFile, updateRPSFile } from '../common_modules/dynamicFile.mjs';

export const call = ['rock', 'paper', 'scissors'];

export function exec(serverProperties) {
	const botPick = call[Math.floor(Math.random() * 3)];

	let returnTitle = '';

	if (
		(serverProperties.lastMessage.content === 'rock' && botPick === 'paper') ||
		(serverProperties.lastMessage.content === 'paper' && botPick === 'scissors') ||
		(serverProperties.lastMessage.content === 'scissors' && botPick === 'rock')
	) {
		returnTitle = 'I Won!';
		rpsFile.botScore++;
		updateRPSFile();
	} else if (
		(serverProperties.lastMessage.content === 'rock' && botPick === 'scissors') ||
		(serverProperties.lastMessage.content === 'paper' && botPick === 'rock') ||
		(serverProperties.lastMessage.content === 'scissors' && botPick === 'paper')
	) {
		returnTitle = 'You Won!';
		rpsFile.userScore++;
		updateRPSFile();
	} else {
		returnTitle = 'We Tied!';
	}

	msgRPSResult(serverProperties, returnTitle, rpsFile.botScore, rpsFile.userScore);
}
