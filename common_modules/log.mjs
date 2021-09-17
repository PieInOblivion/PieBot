export function log() {
	let args = Array.prototype.slice.call(arguments);
	args.unshift(logPrefix());
	console.log.apply(console, args);
}

function logPrefix() {
	const d = new Date();
	function p(x) { return ((x < 10 ? '0' : '') + x) }
	const time = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
	const date = `${p(d.getDate())}/${p(d.getMonth())}/${d.getFullYear()}`;
	return `[${date} ${time}]`;
}