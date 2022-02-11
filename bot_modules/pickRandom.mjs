import { msgPickRandom } from '../common_modules/messageResponses.mjs';

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

	msgPickRandom(serverProperties, res, min, max);
}