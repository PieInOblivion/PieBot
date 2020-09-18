export function conLog(msg, type = 'INFO') {
	const d = new Date();
	function p(x) { return ((x < 10 ? '0' : '') + x) }
	const time = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
	const date = `${p(d.getDate())}/${p(d.getMonth())}/${d.getFullYear()}`;
	console.log(`[${time} ${date} ${type}]`, msg);
}