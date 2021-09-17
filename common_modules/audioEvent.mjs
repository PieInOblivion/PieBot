import { loadNextSong } from './loadNextSong.mjs';
import { playAudio } from './playAudio.mjs';

export async function audioEvent(serverProperties) {
	if (!serverProperties.playing) {
		await loadNextSong(serverProperties);

		playAudio(serverProperties);
	}
}
