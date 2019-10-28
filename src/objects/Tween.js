import Phaser from 'phaser';
import GameObject from './GameObject';
import Scene, { insertBeforeToScene } from '../Scene';
import { insertBefore } from '../utils';
import TYPES from '../types';
import { omit } from 'lodash';

const performedProps = {
	play: (inst, { play }, object) => {
		if (play) {
			object.play(play);
		} else {
			object.stop();
		}
	}
};

const allowedProps = ['play'];

class Tween extends GameObject {
	register(scene, parent) {
		const { animations } = this.props;
		this.scene = scene;

		window.tween = this;

		this.parent = parent;
		this.instancePool = [];
		this.tweenQueue = [];
		this.animationPool = {};

		this.animationsConfig = this.prepareConfig(animations);
		this.registered = true;
		this.registerChildren();
		this.update(this.props);

		return this.instancePool;
	}

	add(child) {
		if (this.registered) {
			const instance = child.register(this.scene);
			this.instancePool.push(instance);
			this.parent.add(instance);
			this.pool.push(child);
		} else {
			this.pool.push(child);
		}
	}

	insertBefore(child, beforeChild) {
		const { parent } = this;

		this.add(child);

		if (parent instanceof Scene) {
			insertBeforeToScene(parent, child.instance, beforeChild.instance);
		} else {
			insertBefore(parent.instance.list, child.instance, beforeChild.instance);
		}
	}

	registerChildren() {
		const { instancePool, pool, scenePool, scene } = this;

		for (const elem of pool) {
			const child = elem.register(this.scene);
			instancePool.push(child);
		}

		for (const child of scenePool) {
			addToScene(scene, child);
		}
	}

	prepareConfig(configs) {
		return Object.entries(configs).reduce((acc, [key, config]) => {
			const conf = omit(config, 'repeat');

			if (config.repeat) {
				conf.loop = conf.loop || config.repeat;
			}

			acc[key] = conf;

			return acc;
		}, {});
	}

	play(key) {
		if (this.instance) {
			this.tweenQueue.push(key);
		} else {
			this.startTween(key);
		}
	}

	next() {
		if (this.instance) {
			this.instance.stop();
			this.instance = null;
		}

		this.shouldStop = false;

		const key = this.tweenQueue.shift();
		if (key) this.startTween(key);
	}

	startTween(key) {
		const { instancePool, scene, tweenQueue, animationsConfig } = this;
		const config = animationsConfig[key];

		if (!config) return;

		const tween = scene.add.tween({
			...config,
			targets: instancePool,
			onComplete: () => this.handleOnComplete(key),
			onLoop: () => this.handleOnLoop(key)
		});

		this.instance = tween;

		return tween;
	}

	stop() {
		if (this.instance) {
			this.shouldStop = true;
		}
	}

	handleOnComplete(key) {
		const { onComplete } = this.props || {};

		if (onComplete) {
			onComplete(key);
		}

		this.next();
	}

	handleOnLoop(key) {
		const { onLoop } = this.props || {};

		if (onLoop) {
			onLoop(key);
		}

		if (this.tweenQueue.length || this.shouldStop) {
			this.next();
		}
	}
}

Object.assign(Tween.prototype, {
	shouldStop: false,
	type: TYPES.CONTAINER,
	performedProps,
	allowedProps
});

export default Tween;
