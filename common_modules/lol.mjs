import cheerio from 'cheerio';
import needle from 'needle';
import twisted from 'twisted';
import { getChampionName } from 'twisted/dist/constants/champions.js';
import { titleFormat } from './titleFormat.mjs'
import keysJSON from '../secret/keys.json';
import config from '../secret/config.json';

const api = new twisted.LolApi({ key: keysJSON.leagueOfLegends });

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
	const response = await needle('get', encodeURI(`https://${config.opggRegion}.op.gg/summoner/userName=${name}`)).catch(err => {
    console.log(`playerRankedStats Error:`, err);
	});
	const $ = cheerio.load(response.body);
	const rank = $('[class=TierRank]').text();
	const wins = $('[class=wins]').text().replace('W', '');
	const losses = $('[class=losses]').text().replace('L', '');
	const winRatio = $('[class=winratio]').text().replace('Win Ratio ', '');
	return { r: rank, w: wins, l: losses, wr: winRatio };
}

export async function liveGameById(id) {
	const game = await api.Spectator.activeGame(id, config.lolRegion).catch(err => {
		console.error(`liveGameById Error:`, err.body.status.status_code, err.body.status.message);
	});
	return (game ? game.response : false);
}

export function champName(id) {
	return titleFormat(getChampionName(id));
}

export async function playerSummary(player) {
	const [ topChampions, rankedStats ] = await Promise.all([playerTopChamps(player.summonerId), playerRankedStats(player.summonerName)]);

	const topChamps = [];

	topChampions.forEach(c => {
		topChamps.push(champName(c.championId));
	});

	return {
		name: player.summonerName,
		topThree: topChamps,
		ranked: rankedStats,
		currentChamp: champName(player.championId),
		team: (player.teamId == 100 ? 'Blue' : 'Red')
	}
}