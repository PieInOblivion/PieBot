import { readdirSync } from 'fs';

// Discrete Bot Modules
import { Client, MessageEmbed } from 'discord.js';
import { conLog } from './common_modules/conLog.mjs';

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
		conLog(`Loaded ${moduleName}`);
	}).catch(err => {
		conLog(`${moduleName}: Error: ${err}`,'HELP');
	});
});

const client = new Client();
const serverProperties = {};

client.on('ready', () => {
	conLog(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { name: 'with the dark arts' }, status: 'online' });
});

client.on('error', (err) => {
	conLog(`Client Error: ${Object.values(err)}`, 'HELP');
});

client.on('reconnecting', () => {
	conLog(`Connecting...`);
});

channelsJSON.forEach(channelID => {
	serverProperties[channelID] = {
		userQueue: [],
		playlistQueue: [],
		playing: null,
		voiceChannel: null,
		dispatcher: null,
		lastMessage: null
	}
});

client.on('message', async (msg) => {
	try {
		// Filter messages to certain voice channels and NOT from itself
		if (serverProperties.hasOwnProperty(msg.channel.id) && !msg.author.bot) {
			conLog(msg.content, 'CMSG');
			serverProperties[msg.channel.id].lastMessage = msg;
			parseRequest(serverProperties[msg.channel.id]);
		}
	} catch (err) {
		conLog(`Message error: ${conLog(err)}`, 'HELP');
		serverProperties[msg.channel.id].lastMessage.channel.send(new MessageEmbed()	
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

client.login(keysJSON.discord).catch(err => {conLog(`Login error: ${err}`, 'ERROR')});