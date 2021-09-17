import { MessageEmbed } from 'discord.js';
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
			serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed().setColor(0xff9900).addField('No LoL Account Binded.', 'First bind an account with: *lolb name*')]});
			return;
		}
	} else {
		searchArg = removePrefix(serverProperties.lastMessage.content);
	}

	const entryUser = await playerByName(searchArg);

	if (!entryUser) {
		serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed().setColor(0xff9900).addField('Unlucky.', 'Could not find that player in OCE')]});
		return;
	}

	const liveGame = await liveGameById(entryUser.id);

	if (!liveGame) {
		serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed().setColor(0xff9900).addField('Unlucky.', `Player doesn't appear to be in a game`)]});
		return;
	}

	serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed().setColor(0xe19205).setTitle(`Game Found: Loading...`)]});

	const liveGamePlayers = [];

	for (let i = 0; i < liveGame.participants.length; i++) {
		liveGamePlayers.push({playerProfile: liveGame.participants[i], stats: null});
	}

	const championJSON = await champJSON();

	await Promise.all(liveGamePlayers.map(async player => {
		player.stats = await playerSummary(player.playerProfile, championJSON);
	}));

	const blueReturnMessage = new MessageEmbed().setColor(0x1f8ecd).setTitle(`Blue Side`);
	const redReturnMessage = new MessageEmbed().setColor(0xee5a52).setTitle(`Red Side`);

	liveGamePlayers.forEach(p => {
		const returnPlayerTitle = `${p.stats.name} - ${p.stats.currentChamp}`;

		let returnPlayerTopChamps = [];

		p.stats.topThree.forEach(c => {
			returnPlayerTopChamps.push((c == p.stats.currentChamp ? `**${c}**` : c));
		})

		let returnPlayerInfo = `${p.stats.ranked.r}\n${p.stats.ranked.w}W ${p.stats.ranked.l}L / ${p.stats.ranked.wr} WR\nTop Champs: ${returnPlayerTopChamps.join(', ')}`;

		if (p.stats.team == 'Blue') {
			blueReturnMessage.addField(returnPlayerTitle, returnPlayerInfo);
		} else {
			redReturnMessage.addField(returnPlayerTitle, returnPlayerInfo);
		}
	});
	
	serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed().setColor(0xe19205).setTitle(`${entryUser.name}'s Live Game Players`), blueReturnMessage, redReturnMessage]});
}