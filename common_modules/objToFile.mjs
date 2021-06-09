import { writeFile } from 'fs';

export function ObjToFile(loc, obj) {
    writeFile(`./secret/${loc.split("/").pop()}`, JSON.stringify(obj), function writeJSON(err) {
		if (err) return console.log(err);
	});
}