import { MessageEmbed } from 'discord.js';

function sendMessageObject(serverProperties, msgObject) {
    serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed(msgObject)] });
}

function sendMessageEmbeds(serverProperties, embedsArray) {
    serverProperties.lastMessage.channel.send({ embeds: embedsArray });
}

//multiple files: not currently playing
export function msgNotPlaying(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields: [
            {name: `Nice.`, value: `I'm not currently playing anything`}
        ]
    });
}

//leagueBindAccount.mjs
export function msgBinded(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Linked`,
        color: 0x00ffff
    });
}

//leagueCurrentGame.mjs
export function msgLolNotBinded(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields: [
            {name: `No LoL Account Binded.`, value: `First bind an account with: *lolb name*`}
        ]
    });
}

export function msgLolPlayerDoesntExist(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields: [
            {name: `Unlucky.`, value: `Could not find that player in OCE`}
        ]
    });
}

export function msgLolPlayerNotInGame(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields: [
            {name: `Unlucky.`, value: `Player doesn't appear to be in a game`}
        ]
    });
}

export function msgLolLoadingGameData(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xe19205,
        title: `Game Found: Loading...`
    });
}

export function msgLolPlayerSummary(serverProperties, headerEmbed, blueEmbed, RedEmbed) {
    sendMessageEmbeds(serverProperties, [
        new MessageEmbed(headerEmbed),
        new MessageEmbed(blueEmbed),
        new MessageEmbed(RedEmbed)
    ]);
}

//nowPlaying.mjs
export function msgNowPlaying(serverProperties, title) {
    sendMessageObject(serverProperties, {
        title: `Now Playing: `,
        color: 0x00ffff,
        fields: [
            {name: title, value: `**https://www.youtube.com/watch?v=${serverProperties.playing}**`},
            {name: `Repeat:`, value: (serverProperties.repeat ? 'On' : 'Off'), inline: true}
        ]
    });
}

//osu!.mjs
export function msgOsuPlayer(serverProperties, user) {
    sendMessageObject(serverProperties, {
        title: user.name,
        color: 0xa4136a,
        thumbnail: {url: `https://a.ppy.sh/${user.id}`},
        fields: [
            {name: `Level`, value: Math.round(user.level).toString(), inline: true},
            {name: `Accuracy`, value: user.accuracyFormatted, inline: true},
            {name: `Play Count`, value: user.counts.plays.toString(), inline: true},
            {name: `Country Rank (${user.country})`, value: user.pp.countryRank.toString(), inline: true},
            {name: `Rank`, value: user.pp.rank.toString(), inline: true},
            {name: `Total Score`, value: user.scores.total.toString(), inline: true},
            {name: `SS / S / A`, value: `${user.counts.SS} / ${user.counts.S} / ${user.counts.A}`, inline: true},
            {name: `PP`, value: Math.round(user.pp.raw).toString(), inline: true},
        ]
    });
}

export function msgOsuPlayerNotFound(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Player search got no results`,
        color: 0xff9900
    });
}

//pause.mjs
export function msgPaused(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Paused`,
        color: 0x00ffff
    });
}

//pickRandom.mjs
export function msgPickRandom(serverProperties, res, min, max) {
    sendMessageObject(serverProperties, {
        title: `I pick ${res}`,
        color: 0x00ffff,
        fields: [
            {name: `min`, value: min.toString(), inline: true},
            {name: `max`, value: max.toString(), inline: true}
        ]
    });
}

//play.mjs
export function msgNotInVoiceChannel(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields: [
            {name: `I can't see you`, value: `Please be in a voice channel first!`}
        ]
    });
}

export function msgPlayQueueStats(serverProperties, addedPlaylistSongsLength) {
    sendMessageObject(serverProperties, {
        title: `Queue Stats`,
        color: 0x00ffff,
        fields: [
            {name: `User Queue: ${serverProperties.userQueue.length}`, value: `0 Added`, inline: true},
            {name: `Playlist Queue: ${serverProperties.playlistQueue.length}`, value: `${addedPlaylistSongsLength} Added`, inline: true}
        ]
    });
}

export function msgPlayNowPlaying(serverProperties, title, IDAdded) {
    sendMessageObject(serverProperties, {
        title: `Now Playing:`,
        color: 0x00ffff,
        fields: [
            {name: title, value: `**https://www.youtube.com/watch?v=${IDAdded}**`}
        ]
    });
}

export function msgPlayAddedSong(serverProperties, title, IDAdded) {
    sendMessageObject(serverProperties, {
        title: `Added to queue:`,
        color: 0x00ffff,
        fields: [
            {name: title, value: `**https://www.youtube.com/watch?v=${IDAdded}**`},
            {name: `User Queue Length:`, value: serverProperties.userQueue.length.toString(), inline: true},
            {name: `Playlist Queue Length:`, value: serverProperties.playlistQueue.length.toString(), inline: true}
        ]
    });
}

//queue.mjs
export function msgQueueStats(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Queue Stats`,
        color: 0x00ffff,
        fields: [
            {name: `User Queue Length:`, value: serverProperties.userQueue.length.toString(), inline: true},
            {name: `Playlist Queue Length:`, value: serverProperties.playlistQueue.length.toString(), inline: true}
        ]
    });
}

//remove.mjs
export function msgRemoveNoSongs(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields: [
            {name: `Nice.`, value: `No songs in user queue to remove`}
        ]
    });
}

export function msgRemoveLastSong(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Removed last song added to user queue`,
        color: 0x00ffff
    });
}

//repeat.mjs
export function msgRepeatChange(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0x00ffff,
        fields: [
            {name: `Repeat:`, value: (serverProperties.repeat ? 'On' : 'Off')}
        ]
    });
}

//resume.mjs
export function msgResumed(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Resumed`,
        color: 0x00ffff
    });
}

//rockPaperScissors.mjs
export function msgRPSResult(serverProperties, returnTitle, botScore, userScore) {
    sendMessageObject(serverProperties, {
        title: returnTitle,
        author: {name: "Scoreboard"},
        color: 0x00ffff,
        fields: [
            {name: "Bot", value: botScore.toString(), inline: true},
            {name: "Users", value: userScore.toString(), inline: true}
		]
    });
}

//skip.mjs
export function msgSkipped(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Skipped`,
        color: 0x00ffff
    });
}

export function msgSkipFailed(serverProperties) {
    sendMessageObject(serverProperties, {
        color: 0xff9900,
        fields:[
            {name: `Nice.`, value: `Only one song in queue or not currently playing`}
        ]
    });
}

//playAudio.mjs
export function msgPlayFailed(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Song download failed: https://www.youtube.com/watch?v=${serverProperties.playing}`,
        color: 0xff0000
    });
}

export function msgPlayQueueEmpty(serverProperties) {
    sendMessageObject(serverProperties, {
        title: `Song queue is empty`,
        color: 0x00ffff
    });
}

//play.mjs, loadNextSong.mjs
export function msgYouTubeSearchFailed(serverProperties, search) {
    sendMessageObject(serverProperties, {
        title: `Search failed: ${search}`,
        color: 0xff0000
    });
}

/*
import {  } from '../common_modules/messageResponses.mjs';
import {  } from './messageResponses.mjs';
export function msg(serverProperties) {
    sendMessageObject(serverProperties, {

    });
}
*/