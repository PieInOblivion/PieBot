import { MessageEmbed } from 'discord.js';
import { youtubeLinkToArray, youtubeSearchtoID, youtubeIDtoTitle } from '../common_modules/ytSearch.mjs';
import { spotifyURItoArray, addSearchKey } from '../common_modules/spotifySearch.mjs';
import { shuffle } from '../common_modules/arrayShuffle.mjs';
import { audioEvent } from '../common_modules/audioEvent.mjs';
import { userInVoiceChannel } from '../common_modules/userInVoiceChannel.mjs';

export const call = ['play '];

export async function exec(serverProperties) {
	if (!userInVoiceChannel(serverProperties)) {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed().setColor(0xff9900).addField("I can't see you", 'Please be in a voice channel first!')
		);
		return;
	}

	switch (true) {
		case isYoutubeLink(serverProperties.lastMessage.content):
			const youtubeResult = await youtubeLinkToArray(serverProperties.lastMessage.content);
			if (youtubeResult.length == 1) {
				serverProperties.userQueue.push(youtubeResult[0]);
				userQueueMessage(serverProperties, youtubeResult[0]);
			} else {
				serverProperties.playlistQueue.push(...shuffle(youtubeResult));
				playlistQueueMessage(serverProperties, youtubeResult.length);
			}
			break;

		case isSpotifyURI(serverProperties.lastMessage.content):
			const spotifyResult = await spotifyURItoArray(serverProperties.lastMessage.content);
			const searchKeyArray = addSearchKey(spotifyResult);
			serverProperties.playlistQueue.push(...shuffle(searchKeyArray));
			playlistQueueMessage(serverProperties, spotifyResult.length);
			break;

		default:
			const searchResult = await youtubeSearchtoID(serverProperties.lastMessage.content);
			serverProperties.userQueue.push(searchResult);
			userQueueMessage(serverProperties, searchResult);
	}

	audioEvent(serverProperties);
}

function isYoutubeLink(link) {
	return link.includes('youtu');
}

function isSpotifyURI(link) {
	return link.includes('spotify:');
}

async function playlistQueueMessage(serverProperties, addedPlaylistSongsLength) {
	serverProperties.lastMessage.channel.send(
		new MessageEmbed()
			.setTitle(`Queue Stats`)
			.addField(`User Queue: ${serverProperties.userQueue.length}`, `0 Added`, true)
			.addField(`Playlist Queue: ${serverProperties.playlistQueue.length}`, `${addedPlaylistSongsLength} Added`, true)
			.setColor(0x00ffff)
	);
}

async function userQueueMessage(serverProperties, IDAdded) {
	const title = await youtubeIDtoTitle(IDAdded);

	if (!serverProperties.voiceChannel) {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed()
				.setColor(0x00ffff)
				.setTitle('Now Playing:')
				.addField(title, `**https://www.youtube.com/watch?v=${IDAdded}**`)
		);
	} else {
		serverProperties.lastMessage.channel.send(
			new MessageEmbed()
				.setColor(0x00ffff)
				.setTitle('Added to queue:')
				.addField(title, `**https://www.youtube.com/watch?v=${IDAdded}**`)
				.addField(`User Queue Length:`, serverProperties.userQueue.length, true)
				.addField(`Playlist Queue Length:`, serverProperties.playlistQueue.length, true)
		);
	}
}
