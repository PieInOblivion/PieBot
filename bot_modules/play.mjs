import { conLog } from '../common_modules/conLog.mjs';
import { MessageEmbed } from 'discord.js';
import { youtubeLinkToArray } from '../common_modules/ytSearch.mjs';
import { shuffle } from '../common_modules/arrayShuffle.mjs';

import ytdl from 'ytdl-core-discord';

export const call = ['play '];

export async function exec(serverProperties) {

	switch(true) {
		case isYoutubeLink(serverProperties.lastMessage.content):
			const result = await youtubeLinkToArray(serverProperties.lastMessage.content);
			conLog(result);
			// shuffle then add to server playlistqueue
			break;

		case isSpotifyURI(serverProperties.lastMessage.content):
			const result = null;
			conLog(result);
			// shuffle then add to server playlistqueue
			break;

		default:
			const result = await youtubeSearchtoID(serverProperties.lastMessage.content);
			conLog(result);
			// push to userqueue
	}
	

}

function isYoutubeLink(link) {
	return link.includes('youtu');
}

function isSpotifyURI(link) {
	return link.includes('spotify:');
}