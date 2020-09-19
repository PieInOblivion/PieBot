export const call = ['help'];

export function exec(serverProperties) {

	serverProperties.lastMessage.author.send([
		"```",
		"Hello User,",
		"I am PieInOblivion's Discord Bot.",
		" ",
		"My current commands are;",
		"help",
		"rock",
		"paper",
		"scissors",
		"play *Text search, YouTube song url, YouTube playlist url, Spotify album URI, Spotify playlist URI*",
		"np",
		"skip",
		"pause",
		"resume",
		"stop",
		"queue",
		"remove",
		"osu *username*",
		"pick",
		"pick *maximum*",
		"pick *minimum* *maximum*",
		"```"
	].join("\n"));
	
} 