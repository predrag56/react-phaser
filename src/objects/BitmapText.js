import Phaser from 'phaser';
import GameObject from './GameObject';
import {
	fontSize,
	font as fontFn,
	width,
	height,
	align as alignFn,
	origin,
	interactive,
	textChildren
} from './GameObject/performedProps';
import TYPES from '../types';

export const allowedProps = [
	'x',
	'y',
	'key',
	'children',
	'fontSize',
	'font',
	'interactive',
	'width',
	'height',
	'align',
	'origin',
	'visible'
];

export const performedProps = {
	children: textChildren,
	fontSize,
	font: fontFn,
	width,
	height,
	align: alignFn,
	origin,
	interactive
};

class BitmapText extends GameObject {
	register(scene) {
		const { x, y, children, font, size, align } = this.props;
		this.scene = scene;
		this.preRegister();
		this.instance = new Phaser.GameObjects.BitmapText(scene, x, y, font, children, size, align);
		scene.add.existing(this.instance);
		this.registered = true;
		this.postRegister();
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(BitmapText.prototype, {
	type: TYPES.BITMAPTEXT,
	performedProps,
	allowedProps
});

export default BitmapText;
