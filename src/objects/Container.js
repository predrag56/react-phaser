import Phaser from 'phaser';
import GameObject from './GameObject';
import TYPES from '../types';

const performedProps = {};

const allowedProps = ['x', 'y', 'z', 'width', 'height', 'alpha', 'angle', 'scale', 'tint', 'visible'];

class Container extends GameObject {
	register(scene) {
		const { x, y } = this.props;
		this.scene = scene;
		this.preRegister();
		this.instance = new Phaser.GameObjects.Container(scene, x, y);
		scene.add.displayList.add(this.instance);
		this.registered = true;
		this.update(this.props);
		this.registerChildren();
		this.postRegister();

		return this.instance;
	}
}

Object.assign(Container.prototype, {
	type: TYPES.CONTAINER,
	performedProps,
	allowedProps
});

export default Container;
