//import { msgPlayFailed, msgPlayQueueEmpty } from './messageResponses.mjs';
import { msgPlayQueueEmpty } from './messageResponses.mjs';
import {
	entersState,
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
	StreamType,
} from '@discordjs/voice';
import { loadNextSong } from './loadNextSong.mjs';
import { resetProperties } from './resetServerProperties.mjs';
import ytdl from 'ytdl-core';
//import { stream } from 'play-dl';

export async function playAudio(serverProperties) {
	/*
	const source = await stream(serverProperties.playing).catch(err => {
		msgPlayFailed(serverProperties);
		console.log("enterState:", err);
		console.log("serverProperties:", serverProperties);
		songEnded(serverProperties);
	});
	*/

	const source = await ytdl(serverProperties.playing, {
		filter: 'audioonly',
		quality: 'highestaudio',
		dlChunkSize: 0,
		highWaterMark: 1<<22
	});


	if (source) {
		if (!serverProperties.voiceConnection) {
			serverProperties.voiceConnection = await joinVoiceChannel({
				channelId: serverProperties.lastMessage.member.voice.channel.id,
				guildId: serverProperties.lastMessage.member.voice.channel.guildId,
				adapterCreator: serverProperties.lastMessage.member.voice.channel.guild.voiceAdapterCreator
			});
		}

		const resource = createAudioResource(source, { inputType: StreamType.Arbitrary });

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
		msgPlayQueueEmpty(serverProperties);

		resetProperties(serverProperties);
	}
}