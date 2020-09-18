export const call = ['help'];

export function exec(serverProperties) {
	serverProperties.lastMessage.author.send([
		"```",
		"Hello User,",
		"I am PieInOblivion's Discord Bot.",
		" ",
		"My current commands are;",
		"help",
		"rock, paper or scissors (Pick one)",
		"play 'YouTube Link, YouTube Search or Spotify playlist URI'",
		"np (Now Playing)",
		"list 'Title of playlist'",
		"skip",
		"pause",
		"resume",
		"stop",
		"queue",
		"remove (Removes last song in queue)",
		"osu 'username'",
		"pick 'any number greater than 0'",
		"```"
	].join("\n"));
} 