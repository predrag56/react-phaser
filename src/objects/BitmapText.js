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

const allowedProps = [
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

const performedProps = {
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
		this.instance = new Phaser.GameObjects.BitmapText(scene, x, y, font, children, size, align);
		scene.add.existing(this.instance);
		this.registered = true;
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
