import GameObject from './GameObject';
import { setFillStyle, stroke, interactive, origin, size } from './GameObject/performedProps';
import TYPES from '../types';

const allowedProps = [
	'x',
	'y',
	'z',
	'width',
	'height',
	'fillColor',
	'alpha',
	'angle',
	'strokeWidth',
	'strokeColor',
	'strokeAlpha',
	'smoothness',
	'scale',
	'origin',
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

class Rectangle extends GameObject {
	register(scene) {
		const { x, y, width, height, fillColor } = this.props;
		this.scene = scene;
		this.instance = scene.add.rectangle(x, y, width, height, fillColor);
		this.registered = true;
		window.rectangle = this;
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Rectangle.prototype, {
	type: TYPES.RECTANGLE,
	performedProps,
	allowedProps
});

export default Rectangle;
