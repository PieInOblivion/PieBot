import { msgBinded } from '../common_modules/messageResponses.mjs';
import { removePrefix } from '../common_modules/removePrefix.mjs';
import { lolFile, updateLolFile } from '../common_modules/dynamicFile.mjs';

export const call = ['lolb '];

export function exec(serverProperties) {
    lolFile[serverProperties.lastMessage.author.id] = removePrefix(serverProperties.lastMessage.content);

    updateLolFile();

    msgBinded(serverProperties);
}