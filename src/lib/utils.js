export const insertBefore = (arr, b, a) => {
	const indexA = arr.indexOf(a);
	if (indexA < -1) return arr;
	const indexB = arr.indexOf(b);
	if (indexB) arr.splice(indexB, 1);
	arr.splice(indexA, 0, b);
	return arr;
};
