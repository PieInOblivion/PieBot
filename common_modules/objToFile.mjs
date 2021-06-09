import { writeFile } from 'fs';

export function ObjToFile(loc, obj) {
	const l = `./secret/${loc.split("/").pop()}`;
    writeFile(l, JSON.stringify(obj), function writeJSON(err) {
		if (err) return console.log(err);
	});
}