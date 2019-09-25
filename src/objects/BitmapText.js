import Phaser from 'phaser';
import GameObject from './GameObject';
import TYPES from '../types';

const allowedProps = ['x', 'y', 'key', 'children', 'fontSize', 'font', 'width', 'height', 'align', 'origin'];

const defaultProps = {
	origin: [0, 0]
};

const performedProps = {
	children: (inst, { children }) => {
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
	},
	fontSize: (inst, { fontSize }) => inst.setFontSize(fontSize),
	font: (inst, { font }) => inst.setFont(font),
	width: (inst, { width }) => inst.width(width),
	height: (inst, { height }) => inst.height(height),
	align: (inst, { align }) => {
		if (align === 'left') inst.setLeftAlign();
		if (align === 'center') inst.setCenterAlign();
		if (align === 'right') inst.setRightAlign();
	},
	origin: (inst, { origin }) => inst.setOrigin(...origin)
};

class BitmapText extends GameObject {
	register(scene) {
		const { x, y, children, font, size, align } = this.props;
		this.scene = scene;
		this.instance = new Phaser.GameObjects.BitmapText(scene, x, y, font, children, size, align);
		scene.add.existing(this.instance);
		this.registered = true;

		this.update(this.props);

		return this.instance;
	}
}

Object.assign(BitmapText.prototype, {
	name: '',
	type: TYPES.BITMAPTEXT,
	performedProps,
	allowedProps,
	defaultProps
});

export default BitmapText;
