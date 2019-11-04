import Phaser from 'phaser';
import GameObject from './GameObject';
import Scene, { insertBeforeToScene } from '../Scene';
import { insertBefore } from '../utils';
import TYPES from '../types';
import emptyObject from 'fbjs/lib/emptyObject';
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

const getInst = (el) => el.instance;

class Tween extends GameObject {
	register(scene, parent) {
		const { animations } = this.props;
		this.scene = scene;

		window.tween = this;

		this.parent = parent;
		this.children = [];
		this.tweenQueue = [];
		this.animationPool = {};

		this.animationsConfig = this.prepareConfig(animations);
		this.registered = true;
		this.registerChildren();
		this.update(this.props);

		return this.getChildren();
	}

	getChildren() {
		return this.children.map(getInst);
	}

	add(child) {
		if (this.registered) {
			const instance = child.register(this.scene);
			this.children.push(child);
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
		const { children, pool, scenePool, scene } = this;

		for (const elem of pool) {
			const child = elem.register(this.scene);
			children.push(elem);
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
		const { replaceAnimation } = this.props;
		const { queue, complex } = this.animationsConfig[key];
		if (complex) {
			this.play(queue[0]);
			this.tweenQueue.push(...queue.slice(1));
			return;
		}
		this.shouldStop = false;

		if (this.instance) {
			this.tweenQueue = [];
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

		const key = this.tweenQueue.shift();

		if (key) this.startTween(key);
	}

	startTween(key) {
		const { children, scene, tweenQueue, animationsConfig } = this;
		const config = animationsConfig[key];

		if (!config) return;

		const { onLoop, onComplete, onStart } = config;
		let { props } = config;
		let from = emptyObject;
		if (props instanceof Array) {
			[from, props] = props;
		}

		if (from !== emptyObject) {
			children.forEach((child) => child.forceUpdate(from));
		}

		setTimeout(() => {
			const tween = scene.add.tween({
				...config,
				props,
				targets: this.getChildren(),
				onComplete: () => {
					onComplete && onComplete(key);
					this.handleOnComplete(key);
				},
				onLoop: () => {
					onLoop && onLoop(key);
					this.handleOnLoop(key);
				},
				onStart: () => {
					onStart && onStart(key);
				}
			});

			this.instance = tween;
		});

		return tween;
	}

	stop() {
		if (this.instance) {
			this.shouldStop = true;
		}
	}

	handleOnComplete(key) {
		const { onComplete } = this.props || {};

		if (onComplete && !this.tweenQueue.length) {
			onComplete(key);
		}

		this.next();
	}

	handleOnLoop(key) {
		const { onLoop } = this.props || {};

		if (onLoop) {
			onLoop(key);
		}

		if (this.shouldStop) {
			this.next();
		}
	}
}

Object.assign(Tween.prototype, {
	shouldStop: false,
	type: TYPES.TWEEN,
	performedProps,
	allowedProps
});

export default Tween;
