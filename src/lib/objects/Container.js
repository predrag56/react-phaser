import Phaser from 'phaser';
import GameObject from './GameObject';
import TYPES from '../types';

const performedProps = {
	width: (inst, { width }) => inst.displayWidth(width),
	height: (inst, { height }) => inst.displayHeight(height)
};

const allowedProps = ['x', 'y', 'z', 'alpha', 'angle', 'scale', 'tint', 'visible'];

class Container extends GameObject {
	register(scene) {
		const { x, y } = this.props;
		this.scene = scene;
		this.instance = new Phaser.GameObjects.Container(scene, x, y);
		scene.add.displayList.add(this.instance);
		this.registered = true;
		this.update(this.props);
		this.registerChildren();

		return this.instance;
	}
}

Object.assign(Container.prototype, {
	type: TYPES.CONTAINER,
	performedProps,
	allowedProps
});

export default Container;
