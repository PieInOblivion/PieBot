import { MessageEmbed } from 'discord.js';
import { removePrefix } from '../common_modules/removePrefix.mjs';
import { lolFile, updateLolFile } from '../common_modules/dynamicFile.mjs';

export const call = ['lolb '];

export function exec(serverProperties) {
    lolFile[serverProperties.lastMessage.author.id] = removePrefix(serverProperties.lastMessage.content);

    updateLolFile();

    serverProperties.lastMessage.channel.send({ embeds: [new MessageEmbed().setColor(0x00ffff).setTitle('Linked')]});
}