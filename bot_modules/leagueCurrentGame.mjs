import { MessageEmbed } from 'discord.js';
import { playerByName, liveGameById, playerSummary } from '../common_modules/lol.mjs';

export const call = ['lolc '];

export async function exec(serverProperties) {
	const searchArg = serverProperties.lastMessage.content.slice(call[0].length);

	const entryUser = await playerByName(searchArg);

	if (!entryUser) {
		serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0xff9900).addField('Unlucky.', 'Could not find that player in OCE'));
		return;
	}

	const liveGame = await liveGameById(entryUser.id);

	if (!liveGame) {
		serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0xff9900).addField('Unlucky.', `Player doesn't appear to be in a game`));
		return;
	}

	serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0xe19205).setTitle(`Game Found: Loading...`));

	const liveGamePlayers = [];

	for (let i = 0; i < liveGame.participants.length; i++) {
		liveGamePlayers.push({playerProfile: liveGame.participants[i], stats: null});
	}

	await Promise.all(liveGamePlayers.map(async player => {
		player.stats = await playerSummary(player.playerProfile);
	}));

	const blueReturnMessage = new MessageEmbed().setColor(0x1f8ecd).setTitle(`Blue Side`);
	const redReturnMessage = new MessageEmbed().setColor(0xee5a52).setTitle(`Red Side`);

	liveGamePlayers.forEach(p => {
		const returnPlayerTitle = `${p.stats.name} - ${p.stats.currentChamp}`;

		let returnPlayerTopChamps = [];

		p.stats.topThree.forEach(c => {
			returnPlayerTopChamps.push((c == p.stats.currentChamp ? `**${c}**` : c));
		})

		let returnPlayerInfo = `${p.stats.ranked.r}\n${p.stats.ranked.w} Wins\n${p.stats.ranked.l} Losses\n${p.stats.ranked.wr} Win Ratio\nTop Champs: ${returnPlayerTopChamps.join(', ')}`;

		if (p.stats.team == 'Blue') {
			blueReturnMessage.addField(returnPlayerTitle, returnPlayerInfo);
		} else {
			redReturnMessage.addField(returnPlayerTitle, returnPlayerInfo);
		}
	});
	
	serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0xe19205).setTitle(`${entryUser.name}'s Live Game Players`));
	serverProperties.lastMessage.channel.send(blueReturnMessage);
	serverProperties.lastMessage.channel.send(redReturnMessage);
}