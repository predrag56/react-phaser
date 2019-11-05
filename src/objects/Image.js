import Phaser from 'phaser';
import GameObject from './GameObject';
import {
	width,
	height,
	interactive,
	origin,
	mask,
	texture as textureFn,
	frame as frameFn
} from './GameObject/performedProps';
import TYPES from '../types';

const allowedProps = [
	'texture',
	'frame',
	'x',
	'y',
	'z',
	'width',
	'height',
	'origin',
	'alpha',
	'angle',
	'scale',
	'tint',
	'visible',
	'interactive',
	'mask'
];

const performedProps = {
	interactive,
	frame: frameFn,
	texture: textureFn,
	width,
	height,
	origin,
	mask
};

class Image extends GameObject {
	register(scene) {
		const { x, y, texture, frame } = this.props;
		this.scene = scene;
		this.instance = new Phaser.GameObjects.Image(scene, x, y, texture, frame);
		this.registered = true;
		scene.add.displayList.add(this.instance);
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Image.prototype, {
	type: TYPES.IMAGE,
	performedProps,
	allowedProps
});

export default Image;
