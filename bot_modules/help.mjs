export const call = ['help', 'Help'];

export function exec(serverProperties) {
	serverProperties.lastMessage.author.send(
		[
			'```',
			'Hello User,',
			"I am PieInOblivion's Discord Bot.",
			' ',
			'My current commands are;',
			'help',
			'rock',
			'paper',
			'scissors',
			'play *Text search, YouTube song url, YouTube playlist url, Spotify album URI, Spotify playlist URI*',
			'p *Text search, YouTube song url, YouTube playlist url, Spotify album URI, Spotify playlist URI*',
			'np',
			'skip',
			'pause',
			'resume',
			'stop',
			'queue',
			'remove (Removes last user queue added song)',
			'osu *username*',
			'lolc *username*',
			'pick',
			'pick *maximum*',
			'pick *minimum* *maximum*',
			'```',
		].join('\n')
	);
}
