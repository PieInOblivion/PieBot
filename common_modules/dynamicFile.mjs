import { writeFile } from 'fs';
import { readFile } from 'fs/promises';

const rpsLoc = "./secret/rps.json";
const lolLoc = "./secret/lolcBindings.json";

// Node 17 broken this solution
//export let { default: rpsFile } = await import("../secret/rps.json");
//export let { default: lolFile } = await import("../secret/lolcBindings.json");

export let rpsFile = JSON.parse(await readFile(
    new URL("../secret/rps.json", import.meta.url)
));

export let lolFile = JSON.parse(await readFile(
    new URL("../secret/lolcBindings.json", import.meta.url)
));


function ObjToFile(loc, obj) {
    writeFile(loc, JSON.stringify(obj), function writeJSON(err) {
		if (err) return console.log(err);
	});
}

export function updateLolFile() {
    ObjToFile(lolLoc, lolFile);
}

export function updateRPSFile() {
    ObjToFile(rpsLoc, rpsFile);
}