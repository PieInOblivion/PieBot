import { MessageEmbed } from 'discord.js';
import { removePrefix } from '../common_modules/removePrefix.mjs';
import { ObjToFile } from '../common_modules/objToFile.mjs';

export const call = ['lolb '];

const accountLinkingsLoc = '../secret/lolcBindings.json';
const { default: accounts } = await import(accountLinkingsLoc);

export function getAccounts() {
    return accounts;
}

export function exec(serverProperties) {
    accounts[serverProperties.lastMessage.author.id] = removePrefix(serverProperties.lastMessage.content);

    ObjToFile(accountLinkingsLoc, accounts);

    serverProperties.lastMessage.channel.send(new MessageEmbed().setColor(0x00ffff).setTitle('Linked'));
}