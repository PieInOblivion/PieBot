import {
	msgLolNotBinded,
	msgLolPlayerDoesntExist,
	msgLolPlayerNotInGame,
	msgLolLoadingGameData,
	msgLolPlayerSummary
} from '../common_modules/messageResponses.mjs';
import { playerByName, liveGameById, playerSummary, champJSON } from '../common_modules/lol.mjs';
import { removePrefix } from '../common_modules/removePrefix.mjs';
import { lolFile } from '../common_modules/dynamicFile.mjs';

export const call = ['lolc', 'lolc '];

export async function exec(serverProperties) {
	let searchArg = null;

	if(serverProperties.lastMessage.content === 'lolc') {
		const acc = lolFile[serverProperties.lastMessage.author.id];
		if (acc) {
			searchArg = acc;
		} else {
			msgLolNotBinded(serverProperties);
			return;
		}
	} else {
		searchArg = removePrefix(serverProperties.lastMessage.content);
	}

	const entryUser = await playerByName(searchArg);

	if (!entryUser) {
		msgLolPlayerDoesntExist(serverProperties);
		return;
	}

	const liveGame = await liveGameById(entryUser.id);

	if (!liveGame) {
		msgLolPlayerNotInGame(serverProperties);
		return;
	}

	msgLolLoadingGameData(serverProperties)

	const liveGamePlayers = [];

	for (let i = 0; i < liveGame.participants.length; i++) {
		liveGamePlayers.push({playerProfile: liveGame.participants[i], stats: null});
	}

	const championJSON = await champJSON();

	await Promise.all(liveGamePlayers.map(async player => {
		player.stats = await playerSummary(player.playerProfile, championJSON);
	}));

	const blueTeamInfo = {
		title: `Blue Side`,
		color: 0x1f8ecd,
		fields: []
	};

	const redTeamInfo = {
		title: `Red Side`,
		color: 0xee5a52,
		fields: []
	};

	liveGamePlayers.forEach(p => {
		const returnPlayerTitle = `${p.stats.name} - ${p.stats.currentChamp}`;

		let returnPlayerTopChamps = [];

		p.stats.topThree.forEach(c => {
			returnPlayerTopChamps.push((c == p.stats.currentChamp ? `**${c}**` : c));
		})

		let returnPlayerInfo = `${p.stats.ranked.r}\n${p.stats.ranked.w}W ${p.stats.ranked.l}L / ${p.stats.ranked.wr} WR\nTop Champs: ${returnPlayerTopChamps.join(', ')}`;

		if (p.stats.team == `Blue`) {
			blueTeamInfo.fields.push({name: returnPlayerTitle, value: returnPlayerInfo});
		} else {
			redTeamInfo.fields.push({name: returnPlayerTitle, value: returnPlayerInfo});
		}
	});

	msgLolPlayerSummary(serverProperties, { title: `${entryUser.name}'s Live Game Players`, color: 0xe19205}, blueTeamInfo, redTeamInfo);
}