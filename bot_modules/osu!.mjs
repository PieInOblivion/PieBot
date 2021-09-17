import { MessageEmbed } from 'discord.js';
import osu from 'node-osu';
import { removePrefix } from '../common_modules/removePrefix.mjs';
import keysJSON from '../secret/keys.json';

const osuApi = new osu.Api(keysJSON.osu, {
	notFoundAsError: false, // Reject on not found instead of returning nothing. (default: true)
	completeScores: true, // When fetching scores also return the beatmap (default: false)
});

export const call = ['osu '];

export function exec(serverProperties) {
	const searchArg = removePrefix(serverProperties.lastMessage.content);

	osuApi.getUser({ u: searchArg }).then((user) => {
		if (user.length !== 0) {
			serverProperties.lastMessage.channel.send({ embeds: [
				new MessageEmbed()
					.setTitle(user.name)
					.setColor(0xa4136a)
					.addField('Level', Math.round(user.level).toString(), true)
					.addField('Accuracy', user.accuracyFormatted, true)
					.addField('Play Count', user.counts.plays.toString(), true)
					.addField(`Country Rank (${user.country})`, user.pp.countryRank.toString(), true)
					.addField('Rank', user.pp.rank.toString(), true)
					.addField('Total Score', user.scores.total.toString(), true)
					.addField('SS / S / A', `${user.counts.SS} / ${user.counts.S} / ${user.counts.A}`, true)
					.addField('PP', Math.round(user.pp.raw).toString(), true)
					.setThumbnail(`https://a.ppy.sh/${user.id}`)
			]});
		} else {
			serverProperties.lastMessage.channel.send({ embeds: [
				new MessageEmbed().setColor(0xff9900).setTitle(`Player search got no results`)
			]});
		}
	});
}
