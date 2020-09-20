import { loadNextSong } from './loadNextSong.mjs';
import { playAudio } from './playAudio.mjs';

export async function audioEvent(serverProperties) {
	if (!serverProperties.voiceChannel) {
		await loadNextSong(serverProperties);

		playAudio(serverProperties);
	}
}
