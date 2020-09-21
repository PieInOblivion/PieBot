import { readdirSync } from 'fs';

// Discrete Bot Modules
import { Client, MessageEmbed } from 'discord.js';
import { log } from './common_modules/log.mjs';
import { stopBot } from './bot_modules/stop.mjs';

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
		log(`${moduleName}: Error:`,'HELP', err);
	});
});

const client = new Client();
const serverPropertiesTable = {};

channelsJSON.forEach(channelID => {
	serverPropertiesTable[channelID] = {
		userQueue: [],
		playlistQueue: [],
		playing: null,
		voiceChannel: null,
		dispatcher: null,
		lastMessage: null
	}
});

client.on('ready', () => {
	log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { name: 'with the dark arts' }, status: 'online' });
});

client.on('error', (err) => {
	log(`Client Error:`, 'HELP', err);
});

client.on('reconnecting', () => {
	log(`Connecting...`);
});

client.on('voiceStateUpdate', async () => {
	// This will not scale well and could be improved in the future
	// Such as, get server ID which the channel update occured in and check only that voice channel
	Object.keys(serverPropertiesTable).forEach(botTextChannelID => {
		const serverProperties = serverPropertiesTable[botTextChannelID];
		if (serverProperties.voiceChannel != null && serverProperties.voiceChannel.channel.members.size == 1) {
			stopBot(serverProperties);
		}
	});
});

client.on('message', async (msg) => {
	try {
		// Filter messages to certain voice channels and NOT from itself
		if (serverPropertiesTable.hasOwnProperty(msg.channel.id) && !msg.author.bot) {
			log(msg.content, 'CMSG');
			serverPropertiesTable[msg.channel.id].lastMessage = msg;
			parseRequest(serverPropertiesTable[msg.channel.id]);
		}
	} catch (err) {
		log(`Message error:`, 'HELP', err);
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
	log(`Login error:`, 'HELP', err)
});