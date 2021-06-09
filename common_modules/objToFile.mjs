import { writeFile } from 'fs';

export function ObjToFile(loc, obj) {
    writeFile(loc, JSON.stringify(obj), function writeJSON(err) {
		if (err) return console.log(err);
	});
}