export function removePrefix(command) {
    return command.match(/^(\S+)\s(.*)/).slice(1)[1];
}