import { load } from 'cheerio';
import { LolApi } from 'twisted';
import { getJSON, getHTML } from './https.mjs';
import keysJSON from '../secret/keys.json' assert {type: "json"};
import config from '../secret/config.json' assert {type: "json"};

const api = new LolApi({ key: keysJSON.leagueOfLegends });

export async function playerByName(name) {
	const player = await api.Summoner.getByName(name, config.lolRegion).catch(err => {
		console.error(`playerByName Error:`, err.body.status.status_code, err.body.status.message);
	});
	return (player ? player.response : false);
}

export async function playerById(id) {
	const player = await api.Summoner.getById(id, config.lolRegion).catch(err => {
		console.error(`playerByName Error:`, err.body.status.status_code, err.body.status.message);
	});
	return (player ? player.response : false);
}

export async function playerTopChamps(id, max = 3) {
	const champs = await api.Champion.masteryBySummoner(id, config.lolRegion).catch(err => {
		console.error(`playerTopChamps Error:`, err.body.status.status_code, err.body.status.message);
	});
	return (champs ? champs.response.slice(0, max) : false);
}

export async function playerLastMatches(id) {
	const matchList = await api.Match.list(id, config.lolRegion, { queue: 420 }).catch(err => {
		console.error(`playerLastMatches Error:`, err.body.status.status_code, err.body.status.message);
	});
	return (matchList ? matchList.response : false);
}

export async function playerRankedStats(name) {
	const response = await getHTML(encodeURI(`https://${config.opggRegion}.op.gg/summoner/userName=${name}`));
	const $ = load(response.body);
	const rankText = $('[class=tier]').text();
	const rank = rankText[0].toUpperCase() + rankText.slice(1)

	const winloss = $('[class=win-lose]').text().split(' ')
	const wins = winloss[0].slice(0, -1);
	const losses = winloss[1].slice(0, -2);

	const winRatio = $('[class=ratio]:first').text().replace('Win Rate ', '');

	return { r: rank, w: wins, l: losses, wr: winRatio };
}

export async function liveGameById(id) {
	const game = await api.Spectator.activeGame(id, config.lolRegion).catch(err => {
		console.error(`liveGameById Error:`, err.body.status.status_code, err.body.status.message);
	});
	return (game ? game.response : false);
}

export async function champJSON() {
	return await getJSON(config.lolChampIDs);
}

export function champJSONIdToName(json, id) {
	return json.find(champ => champ.id == id).name;
}

export async function playerSummary(player, champInfo) {
	const [ topChampions, rankedStats ] = await Promise.all([playerTopChamps(player.summonerId), playerRankedStats(player.summonerName)]);

	const topChamps = [];

	topChampions.forEach(c => {
		topChamps.push(champJSONIdToName(champInfo, c.championId));
	});

	return {
		name: player.summonerName,
		topThree: topChamps,
		ranked: rankedStats,
		currentChamp: champJSONIdToName(champInfo, player.championId),
		team: (player.teamId == 100 ? 'Blue' : 'Red')
	}
}