# PieBot
PieInOblivion's Discord bot based on nodejs

Listed features and commands will be implemented and working on v1

Until then consider this still in development


## Features
- Multi-server compatibility!
- A unique queue system in which individual song requests take priority above playlists and albums
- Automatically leaves the voice channel when it's alone (Has the side effect of being able to stop it by moving it into an empty voice channel)
- A commands list (help)
- Youtube text searching, urls and playlist urls
- Spotify albums and user playlists
- Now playing
- Skipping
- Pausing
- Resuming
- Stopping (Resets music queues)
- Removing songs from the queue
- Osu! profile display
- Random number picker (with number range support)
- Rock, Paper, Scissors vs the bot


## Commands
### Sends PM with Command List
```
help
```
### Play Rock, Paper or Scissors vs the PieBot
```
rock
```
```
paper
```
```
scissors
```
### Play or Search Music
```
play *Text search, YouTube song url, YouTube playlist url, Spotify album URI, Spotify playlist URI*
```
### Now Playing Title and URL
```
np
```
### Skip Current Song
```
skip
```
### Pause Current Song
```
pause
```
### Resume Current Song
```
resume
```
### Stop Current Playback and Reset Song Queues
```
stop
```
### Show Both Queue Lengths
```
queue
```
### Remove Last Song added in the User Priority Queue. (Useful for removing search mismatches, etc.)
```
remove
```
### Osu! Profile Summary
```
osu *username*
```
### Picks a Random Number from a Range (Defaults between 1 to 10)
```
pick
```
```
pick *maximum*
```
```
pick *minimum* *maximum*
```


## Planned Features (No particular order, suggestions welcome)
- Osu! map recommender (Implementing a similar engine to [OsuHelper](https://github.com/Tyrrrz/OsuHelper))
- League of Legends profile display
- League of Legends champion build recommendation
- League of Legends current match summarising
- Rainbow 6: Siege profile summariser
- SoundCloud support?
- Challenge other users to Rock Paper Scissors
- Challenge other users to Tic-tac-toe (Noughts & Crosses)
- Optional prefix support
- Song discovery engine with your favourite YouTube or Spotify playlist as input
- Language translation (Automatic translation of text channels outside of the dedicated bot chat)
- Emoji reaction based voting system


## Usage
1. Rename 'secret_example' to 'secret'
2. Fill each file with the relevant information. 'rps.json' is the Rock Paper Scissors scoreboard, global for all servers the bot is in. 'channels.json' is the id of each text channel you want to bot to read. Add as many text channels from different servers as you want. Multiple text channels for one server might lead to unexpected music queue behaviour.
3. Invite the bot to your server by following DiscordJS' [guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)
4. Run the following:
```
node --experimental-json-modules bot.js
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
