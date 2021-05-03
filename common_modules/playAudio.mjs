import { MessageEmbed } from 'discord.js';
import { loadNextSong } from './loadNextSong.mjs';
import { resetProperties } from './resetServerProperties.mjs';
import ytdl from 'ytdl-core-discord';

export async function playAudio(serverProperties) {
	const stream = ytdl(serverProperties.playing, { filter: 'audioonly', quality: 'highestaudio' });

	if (!serverProperties.voiceChannel) {
		serverProperties.voiceChannel = await serverProperties.lastMessage.member.voice.channel.join();
	}

	// 50 packets = 1 second
	serverProperties.dispatcher = serverProperties.voiceChannel.play(await stream, { type: 'opus', fec: true, volume: false, highWaterMark: 50 });

	serverProperties.dispatcher.on('finish', async () => {
		if (await loadNextSong(serverProperties)) {
			playAudio(serverProperties);
		} else {
			serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0x00ffff).setTitle(`Song queue is empty`));

			resetProperties(serverProperties);
		}
	});
}
