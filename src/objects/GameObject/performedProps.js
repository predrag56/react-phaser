/* eslint-disable no-shadow */
export const width = (inst, { width }) => inst.displayWidth(width);

export const height = (inst, { height }) => inst.displayHeight(height);

export const size = (inst, { width, height }) => inst.setSize(width, height);

export const origin = (inst, { origin }) => inst.setOrigin(...origin);

export const frame = (inst, { frame }) => inst.setFrame(frame);

export const texture = (inst, { texture, frame }) => inst.setTexture(texture, frame);

export const fontSize = (inst, { fontSize }) => inst.setFontSize(fontSize);

export const font = (inst, { font }) => inst.setFont(font);

export const align = (inst, { align }) => {
	if (align === 'left') inst.setLeftAlign();
	if (align === 'center') inst.setCenterAlign();
	if (align === 'right') inst.setRightAlign();
};

export const pause = (inst, { pause }) => {
	if (pause) {
		inst.pause();
	} else {
		inst.resume();
	}
};

export const interactive = (inst, { interactive }) => {
	if (interactive) {
		inst.setInteractive();
	} else {
		inst.disableInteractive();
	}
};

export const textChildren = (inst, { children }) => {
	var error;
	if (Array.isArray(children)) {
		for (let i = 0, l = children.length; i < l; i++) {
			const text = children[i];
			if (typeof text !== 'string' && typeof text !== 'number') {
				error = true;
				break;
			}
		}
	} else if (typeof children !== 'string' && typeof children !== 'number') {
		error = true;
	}

	if (error) {
		throw Error('Children type of <Text> must be "string" or "number"');
	}

	inst.text = children;
};

export const mask = (inst, { mask }) => {
	if (mask) {
		inst.setMask(mask);
	} else {
		inst.clearMask();
	}
};

export const setFillStyle = (inst, { fillColor, alpha }) =>
	console.log(',/???', fillColor) || inst.setFillStyle(fillColor, alpha);

export const setStrokeStyle = (inst, { strokeWidth, strokeColor, strokeAlpha }) =>
	inst.setStrokeStyle(strokeWidth, strokeColor, strokeAlpha);

export const stroke = (inst, { stroke, ...props }) => {
	if (stroke) {
		setStrokeStyle(inst, props);
	} else {
		inst.isStroke = false;
	}
};

/* eslint-enable no-shadow */
