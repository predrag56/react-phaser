import Phaser from 'phaser';
import GameObject from './GameObject';
import { setFillStyle, stroke, interactive, origin } from './GameObject/performedProps';
import TYPES from '../types';

const allowedProps = [
	'x',
	'y',
	'z',
	'radius',
	'fillColor',
	'alpha',
	'strokeWidth',
	'strokeColor',
	'strokeAlpha',
	'scale',
	'visible',
	'interactive',
	'stroke'
];

const performedProps = {
	interactive,
	fillColor: setFillStyle,
	origin,
	stroke
};

class Circle extends GameObject {
	register(scene) {
		const { x, y, radius, fillColor } = this.props;
		this.scene = scene;
		this.instance = scene.add.circle(x, y, radius, fillColor);
		this.registered = true;
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Circle.prototype, {
	type: TYPES.CIRCLE,
	performedProps,
	allowedProps
});

export default Circle;
