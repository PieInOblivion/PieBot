import { MessageEmbed } from 'discord.js';
import {
	entersState,
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
	NoSubscriberBehavior,
} from '@discordjs/voice';
import { loadNextSong } from './loadNextSong.mjs';
import { resetProperties } from './resetServerProperties.mjs';
import play from 'play-dl';

export async function playAudio(serverProperties) {
	let stream = await play.stream(serverProperties.playing);

	if (!serverProperties.voiceConnection) {
		serverProperties.voiceConnection = await joinVoiceChannel({
			channelId: serverProperties.lastMessage.member.voice.channel.id,
			guildId: serverProperties.lastMessage.member.voice.channel.guildId,
			adapterCreator: serverProperties.lastMessage.member.voice.channel.guild.voiceAdapterCreator
		});
	}

	let resource = createAudioResource(stream.stream, { inputType: stream.type });

	let player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play
	}});

	player.play(resource);

	serverProperties.audioPlayer = await entersState(player, AudioPlayerStatus.Playing, 5_000).catch(async err => {
		serverProperties.lastMessage.channel.send({ embeds: [
			new MessageEmbed().setColor(0xff0000).setTitle(`Song download failed`)
		]});
		console.log("enterState:", err);
		console.log("serverProperties:", serverProperties);
		songEnded(serverProperties);
	});

	serverProperties.voiceConnection?.subscribe(player);

	serverProperties.audioPlayer?.on(AudioPlayerStatus.Idle, async () => {
		songEnded(serverProperties);
	});
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