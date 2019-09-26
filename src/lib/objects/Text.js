import Phaser from 'phaser';
import GameObject from './GameObject';
import TYPES from '../types';

const allowedProps = [
	'children',
	'x',
	'y',
	'z',
	'originX',
	'originY',
	'alpha',
	'angle',
	'scale',
	'tint',
	'visible',
	'origin'
];

const defaultProps = {
	origin: [0, 0]
};

const performedProps = {
	width: (inst, { width }) => inst.displayWidth(width),
	height: (inst, { height }) => inst.displayHeight(height),
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
	origin: (inst, { origin }) => inst.setOrigin(...origin)
};

class Text extends GameObject {
	register(scene) {
		const { x, y, style } = this.props;
		this.scene = scene;
		this.instance = new Phaser.GameObjects.Text(scene, x, y, undefined, style);
		this.registered = true;
		scene.add.displayList.add(this.instance);
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Text.prototype, {
	texture: '',
	type: TYPES.IMAGE,
	performedProps,
	allowedProps,
	defaultProps
});

export default Text;
