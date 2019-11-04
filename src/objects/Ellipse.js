import Phaser from 'phaser';
import GameObject from './GameObject';
import { setFillStyle, stroke, interactive, origin, size } from './GameObject/performedProps';
import TYPES from '../types';

const allowedProps = [
	'x',
	'y',
	'z',
	'width',
	'height',
	'color',
	'alpha',
	'angle',
	'strokeWidth',
	'strokeColor',
	'strokeAlpha',
	'smoothness',
	'scale',
	'visible',
	'interactive',
	'stroke'
];

const performedProps = {
	interactive,
	width: size,
	height: size,
	fillColor: setFillStyle,
	origin,
	stroke
};

class Ellipse extends GameObject {
	register(scene) {
		const { x, y, width, height, fillColor } = this.props;
		this.scene = scene;
		this.instance = scene.add.ellipse(x, y, width, height, fillColor);
		this.registered = true;
		window.ellipse = this;
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Ellipse.prototype, {
	type: TYPES.ELLIPSE,
	performedProps,
	allowedProps
});

export default Ellipse;
