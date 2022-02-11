import { msgOsuPlayer, msgOsuPlayerNotFound } from '../common_modules/messageResponses.mjs';
import osu from 'node-osu';
import { removePrefix } from '../common_modules/removePrefix.mjs';
import keysJSON from '../secret/keys.json' assert {type: "json"};

const osuApi = new osu.Api(keysJSON.osu, {
	notFoundAsError: false, // Reject on not found instead of returning nothing. (default: true)
	completeScores: true, // When fetching scores also return the beatmap (default: false)
});

export const call = ['osu '];

export function exec(serverProperties) {
	const searchArg = removePrefix(serverProperties.lastMessage.content);

	osuApi.getUser({ u: searchArg }).then((user) => {
		if (user.length !== 0) {
			msgOsuPlayer(serverProperties, user);
		} else {
			msgOsuPlayerNotFound(serverProperties);
		}
	});
}
