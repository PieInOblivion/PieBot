import { MessageEmbed } from 'discord.js';
import { youtubeLinkToArray, youtubeSearchtoID, youtubeIDtoTitle } from '../common_modules/ytSearch.mjs';
import { spotifyURItoArray, addSearchKey } from '../common_modules/spotifySearch.mjs'; 
import { shuffle } from '../common_modules/arrayShuffle.mjs';
import { audioEvent } from '../common_modules/audioEvent.mjs';
import { userInVoiceChannel } from '../common_modules/userInVoiceChannel.mjs';

export const call = ['play '];

export async function exec(serverProperties) {

	if (!userInVoiceChannel(serverProperties)) {
		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0xff9900)
			.addField("I can't see you", 'Please be in a voice channel first!')
		);
		return;
	}

	const preUserQueue = serverProperties.userQueue.length;
	const prePlaylistQueue = serverProperties.playlistQueue.length;

	switch (true) {
		case isYoutubeLink(serverProperties.lastMessage.content):
			const youtubeResult = await youtubeLinkToArray(serverProperties.lastMessage.content);
			if (youtubeResult.length == 1) {
				serverProperties.userQueue.push(youtubeResult[0]);
				userSearchQueueMessage(serverProperties);
			} else {
				serverProperties.playlistQueue.push(...shuffle(youtubeResult));
				playlistQueueMessage(serverProperties, preUserQueue, prePlaylistQueue);
			}
			break;

		case isSpotifyURI(serverProperties.lastMessage.content):
			const spotifyResult = await spotifyURItoArray(serverProperties.lastMessage.content);
			const searchKeyArray = addSearchKey(spotifyResult);
			serverProperties.playlistQueue.push(...shuffle(searchKeyArray));
			playlistQueueMessage(serverProperties, preUserQueue, prePlaylistQueue);
			break;

		default:
			const searchResult = await youtubeSearchtoID(serverProperties.lastMessage.content);
			serverProperties.userQueue.push(searchResult);
			userSearchQueueMessage(serverProperties);
	}

	audioEvent(serverProperties);
	
}

function isYoutubeLink(link) {
	return link.includes('youtu');
}

function isSpotifyURI(link) {
	return link.includes('spotify:');
}

async function playlistQueueMessage(serverProperties, preUserQueue, prePlaylistQueue) {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setTitle(`Queue Stats`)
			.addField(`User Queue: ${serverProperties.userQueue.length}`, `${serverProperties.userQueue.length - preUserQueue} Added`, true)
			.addField(`Playlist Queue: ${serverProperties.playlistQueue.length}`, `${serverProperties.playlistQueue.length - prePlaylistQueue} Added`, true)
			.setColor(0x00ffff)
		);

}

async function userSearchQueueMessage(serverProperties) {

	const title = await youtubeIDtoTitle(serverProperties.userQueue[0]);

	if (!serverProperties.voiceChannel) {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setColor(0x00ffff)
			.setTitle('Now Playing: ')
			.addField(title, `**https://www.youtube.com/watch?v=${serverProperties.userQueue[0]}**`)
		);

	} else {

		serverProperties.lastMessage.channel.send(new MessageEmbed()
			.setTitle(`Queue Stats`)
			.addField(`User Queue: ${serverProperties.userQueue.length}`, `1 Added`, true)
			.addField(`Playlist Queue: ${serverProperties.playlistQueue.length}`, `0 Added`, true)
			.setColor(0x00ffff)
		);
	}

}