import Phaser from 'phaser';
import GameObject from './GameObject';
import TYPES from '../types';

const performedProps = {};

const allowedProps = [];

class Tween extends GameObject {
	register(scene) {
		const { x, y } = this.props;
		this.scene = scene;

		const tween = this.scene.add.tween({
			targets: this.instance,
			props: {
				[key]: {
					value,
					...config
				}
			},
			onComplete: () => this.removeTransitionTween(key)
		});

		this.registered = true;
		this.update(this.props);
		this.registerChildren();

		return this.instance;
	}

	registerChildren() {
		const { pool, scenePool, scene } = this;

		for (const elem of pool) {
			const child = elem.register(this.scene);
			this.instance.add(child);
		}

		for (const child of scenePool) {
			addToScene(scene, child);
		}
	}
}

Object.assign(Tween.prototype, {
	type: TYPES.CONTAINER,
	performedProps,
	allowedProps
});

export default Tween;
