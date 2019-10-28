const callback = (e) => e.stopPropagation();

export const stopPropagationTouchEvents = (element) => {
	element.addEventListener('touchstart', callback, false);
	element.addEventListener('touchmove', callback, false);
	element.addEventListener('touchend', callback, false);
	element.addEventListener('mousedown', callback, false);
	element.addEventListener('mouseup', callback, false);
	element.addEventListener('mousemove', callback, false);
};
