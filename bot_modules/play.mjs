import { conLog } from '../common_modules/conLog.mjs';
import { MessageEmbed } from 'discord.js';
import { youtubeLinkToArray } from '../common_modules/ytSearch.mjs';
import { shuffle } from '../common_modules/arrayShuffle.mjs';

import ytdl from 'ytdl-core-discord';

export const call = ['play '];

export async function exec(serverProperties) {

	switch(true) {
		case isYoutubeLink(serverProperties.lastMessage.content):
			const youtubeResult = await youtubeLinkToArray(serverProperties.lastMessage.content);
			if (youtubeResult.length == 1) {
				serverProperties.userQueue.push(youtubeResult);
			} else {
				serverProperties.playlistQueue.concat(shuffle(youtubeResult));
			}
			
			break;

		case isSpotifyURI(serverProperties.lastMessage.content):
			const spotifyResult = await spotifyURItoArray(serverProperties.lastMessage.content);
			spotifyResult.forEach(item => {
				item = `%search%${item}`;
			});
			serverProperties.playlistQueue.concat(shuffle(youtubeResult));
			break;

		default:
			const searchResult = await youtubeSearchtoID(serverProperties.lastMessage.content);
			serverProperties.userQueue.push(searchResult);
	}
	
}

function isYoutubeLink(link) {
	return link.includes('youtu');
}

function isSpotifyURI(link) {
	return link.includes('spotify:');
}