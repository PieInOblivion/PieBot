import { MessageEmbed } from 'discord.js';
import {
	entersState,
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
} from '@discordjs/voice';
import { loadNextSong } from './loadNextSong.mjs';
import { resetProperties } from './resetServerProperties.mjs';
import { stream } from 'play-dl';

export async function playAudio(serverProperties) {
	const source = await stream(serverProperties.playing).catch(err => {
		serverProperties.lastMessage.channel.send({ embeds: [
			new MessageEmbed().setColor(0xff0000).setTitle(`Song download failed: https://www.youtube.com/watch?v=${serverProperties.playing}`)
		]});
		console.log("enterState:", err);
		console.log("serverProperties:", serverProperties);
		songEnded(serverProperties);
	});

	if (source) {
		if (!serverProperties.voiceConnection) {
			serverProperties.voiceConnection = await joinVoiceChannel({
				channelId: serverProperties.lastMessage.member.voice.channel.id,
				guildId: serverProperties.lastMessage.member.voice.channel.guildId,
				adapterCreator: serverProperties.lastMessage.member.voice.channel.guild.voiceAdapterCreator
			});
		}

		const resource = createAudioResource(source.stream, { inputType: source.type });

		const player = createAudioPlayer();

		player.play(resource);

		serverProperties.audioPlayer = await entersState(player, AudioPlayerStatus.Playing, 5_000);

		serverProperties.voiceConnection.subscribe(player);

		serverProperties.audioPlayer.on(AudioPlayerStatus.Idle, () => {
			songEnded(serverProperties);
		});
	}
}

async function songEnded(serverProperties) {
	if (await loadNextSong(serverProperties)) {
		playAudio(serverProperties);
	} else {
		serverProperties.lastMessage.channel.send({ embeds: [
			new MessageEmbed().setColor(0x00ffff).setTitle(`Song queue is empty`)
		]});

		resetProperties(serverProperties);
	}
}