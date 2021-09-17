import { MessageEmbed } from 'discord.js';
import {
	entersState,
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
	StreamType
} from '@discordjs/voice';
import { loadNextSong } from './loadNextSong.mjs';
import { resetProperties } from './resetServerProperties.mjs';
import ytdl from 'ytdl-core';

export async function playAudio(serverProperties) {
	const stream = ytdl(serverProperties.playing, { filter: 'audioonly', quality: 'highestaudio' });

	if (!serverProperties.voiceConnection) {
		serverProperties.voiceConnection = await joinVoiceChannel({
			channelId: serverProperties.lastMessage.member.voice.channel.id,
			guildId: serverProperties.lastMessage.member.voice.channel.guildId,
			adapterCreator: serverProperties.lastMessage.member.voice.channel.guild.voiceAdapterCreator
		});
	}

	const player = createAudioPlayer();
	const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
	player.play(resource);
	serverProperties.audioPlayer = await entersState(player, AudioPlayerStatus.Playing, 5_000);
	serverProperties.voiceConnection.subscribe(serverProperties.audioPlayer);


	serverProperties.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
		if (await loadNextSong(serverProperties)) {
			playAudio(serverProperties);
		} else {
			serverProperties.lastMessage.channel.send({ embeds: [
				new MessageEmbed().setColor(0x00ffff).setTitle(`Song queue is empty`)
			]});

			resetProperties(serverProperties);
		}
	});
}
