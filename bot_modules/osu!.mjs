import { MessageEmbed } from 'discord.js';
import osu from 'node-osu';
import keysJSON from '../secret/keys.json';

const osuApi = new osu.Api(keysJSON.osu, {
	notFoundAsError: false, // Reject on not found instead of returning nothing. (default: true)
	completeScores: true // When fetching scores also return the beatmap (default: false)
});

export const call = ['osu '];

export function exec(serverProperties) {
	const searchQuery = serverProperties.lastMessage.content.replace('osu ', '');
		osuApi.getUser({ u: searchQuery }).then(user => {
			if (user.length !== 0) {
				serverProperties.lastMessage.channel.send(new MessageEmbed()
					.setTitle(user.name)
					.setColor(0xa4136a)
					.addField('Level', Math.round(user.level), true)
					.addField('Accuracy', user.accuracyFormatted, true)
					.addField('Play Count', user.counts.plays, true)
					.addField(`Country Rank (${user.country})`, user.pp.countryRank, true)
					.addField('Rank', user.pp.rank, true)
					.addField('Total Score', user.scores.total, true)
					.addField('SS / S / A', `${user.counts.SS} / ${user.counts.S} / ${user.counts.A}`, true)
					.addField('PP', Math.round(user.pp.raw), true)
					.setThumbnail(`https://a.ppy.sh/${user.id}`)
				);
			} else {
				serverProperties.lastMessage.channel.send(new MessageEmbed()
					.setColor(0xff9900)
					.setTitle(`Player search got no results`)
				);
			}
		});
}