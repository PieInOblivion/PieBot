import { writeFile } from 'fs';

const rpsLoc = "./secret/rps.json";
const lolLoc = "./secret/lolcBindings.json";

export let { default: rpsFile } = await import("../secret/rps.json");
export let { default: lolFile } = await import("../secret/lolcBindings.json");

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