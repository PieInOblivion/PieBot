export function shuffle(array) {
	let m = array.length, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
		[array[m], array[i]] = [array[i], array[m]]
  }
  return array;
}