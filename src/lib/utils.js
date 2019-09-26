export const insertBefore = (arr, b, a) => {
	let indexA = arr.indexOf(a);
	if (indexA < -1) return arr;
	let indexB = arr.indexOf(b);
	if (indexB) arr.splice(indexB, 1);
	arr.splice(indexA, 0, b);
	return arr;
};
