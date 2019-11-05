import Phaser from 'phaser';
import { omit } from 'lodash';
import emptyObject from 'fbjs/lib/emptyObject';
import TransparentGameObject from './GameObject/Transparent';
import TYPES from '../types';

const allowedProps = ['play'];

const performedProps = {
	play: (inst, { play }, object) => {
		if (play) {
			object.play(play);
		} else {
			object.stop();
		}
	}
};

class Tween extends TransparentGameObject {
	preRegister(scene, parent) {
		const { animations } = this.props;

		this.tweenQueue = [];
		this.animationPool = {};

		window.tween = this;

		this.animationsConfig = this.prepareConfig(animations);
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
