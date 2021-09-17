import { readdirSync } from 'fs';

// Discrete Bot Modules
import { Client, Intents, MessageEmbed } from 'discord.js';
import { log } from './common_modules/log.mjs';
import { resetProperties } from './common_modules/resetServerProperties.mjs';

// Bot Info
import channelsJSON from './secret/channels.json';
import keysJSON from './secret/keys.json';

const commands = {};

readdirSync('./bot_modules').forEach(moduleName => {
	import(`./bot_modules/${moduleName}`).then(({ exec, call }) => {
		commands[`${moduleName.slice(0, -4)}`] = {
			exec: exec,
			call: call
		};
		log(`Loaded ${moduleName}`);
	}).catch(err => {
		log(`${moduleName}: Error:`, err);
	});
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const serverPropertiesTable = {};

channelsJSON.forEach(serverInfo => {
	serverPropertiesTable[serverInfo.guildId] = {
		channelId: serverInfo.channelId,
		userQueue: [],
		playlistQueue: [],
		playing: null,
		repeat: false,
		voiceConnection: null,
		audioPlayer: null,
		lastMessage: null
	}
});

client.on('ready', () => {
	log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { name: 'with the dark arts' }, status: 'online' });
});

client.on('error', (err) => {
	log(`Client Error:`, err);
});

client.on('reconnecting', () => {
	log(`Connecting...`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	if (oldState.channel?.members.size === 1 && oldState.channel?.members.has(client.user.id)) {
		resetProperties(serverPropertiesTable[oldState.guild.id]);
	}

	if (newState.channel?.members.size === 1 && newState.channel?.members.has(client.user.id)) {
		resetProperties(serverPropertiesTable[newState.guild.id]);
	}
});

client.on('messageCreate', async (msg) => {
	try {
		if (serverPropertiesTable.hasOwnProperty(msg.guild.id) && !msg.author.bot) {
			if (serverPropertiesTable[msg.guild.id].channelId === msg.channel.id) {
				log(`Channel Message:`, msg.content);
				serverPropertiesTable[msg.guild.id].lastMessage = msg;
				parseRequest(serverPropertiesTable[msg.guild.id]);
			}
		}
	} catch (err) {
		log(`Message error:`, err);
		serverPropertiesTable[msg.channel.id].lastMessage.channel.send(new MessageEmbed()	
			.setTitle('Whoops!')
			.setAuthor(`That last command didn't work`)
			.setColor(0xff0000)
		);
	}
});

function parseRequest(serverProperties){
	Object.keys(commands).forEach(cmd => {
		const run = commands[cmd].call.some(term => {
			return serverProperties.lastMessage.content.startsWith(term);
		});
		if (run) commands[cmd].exec(serverProperties);
	});
}

client.login(keysJSON.discord).catch(err => {
	log(`Login error:`, err)
});