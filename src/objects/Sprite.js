import Phaser from 'phaser';
import GameObject from './GameObject';
import {
	width,
	height,
	interactive,
	origin,
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
	'alpha',
	'angle',
	'scale',
	'tint',
	'visible',
	'origin',
	'interactive',
	// 'animations', TODO or leave writeonceonly
	'startFrame',
	'play'
];

const transitionProps = ['x', 'y', 'alpha', 'angle', 'scale', 'tint'];

const performedProps = {
	frame: frameFn,
	texture: textureFn,
	width,
	height,
	interactive,
	play: (inst, { play }, object) => {
		if (play) {
			inst.play(object.getAnimationName(play));
		} else {
			inst.anims.stop();
		}
	},
	origin
};

const eventMap = {
	onAnimationComplete: 'animationcomplete'
};

class Sprite extends GameObject {
	register(scene) {
		const { x, y, texture, frame } = this.props;
		this.scene = scene;
		this.preRegister();
		this.instance = new Phaser.GameObjects.Sprite(scene, x, y, texture, frame);
		this.registered = true;
		scene.add.displayList.add(this.instance);
		scene.add.updateList.add(this.instance);
		this.texture = texture;
		this.registerTransitions();
		this.registerAnimations();
		this.update(this.props);
		this.postRegister();
		return this.instance;
	}

	getAnimationName(name) {
		return name && `${this.id}_${name}`;
	}

	prepareAnimationConfig({ frames, generateFrameNames, generateFrameNumbers, ...config }) {
		const { texture } = this.props;
		const { anims } = this.scene;

		if (!frames) {
			if (generateFrameNames) {
				frames = anims.generateFrameNames(texture, generateFrameNames);
			}

			if (generateFrameNumbers) {
				frames = anims.generateFrameNumbers(texture, generateFrameNumbers);
			}
		}

		return {
			...config,
			frames
		};
	}

	registerAnimations() {
		const { anims, key: sceneKey } = this.scene;
		const { animations } = this.props;

		if (!animations) return;

		this.animKeys = [];

		for (const config of animations) {
			let anim;
			let key = this.getAnimationName(config.key);
			config.key = key;
			this.animKeys.push(key);

			if (key) {
				anim = anims.get(key);
				if (anim) {
					continue;
				}

				anim = new Phaser.Animations.Animation(anims, key, this.prepareAnimationConfig(config));
				anims.anims.set(key, anim);
				anims.emit(Phaser.Animations.Events.ADD_ANIMATION, key, anim);
			}
		}
	}

	postDestroy() {
		const { animKeys, scene } = this;
		if (!animKeys) return;

		for (const key of animKeys) {
			scene.anims.remove(key);
		}
	}
}

Object.assign(Sprite.prototype, {
	texture: '',
	type: TYPES.SPRITE,
	allowedProps,
	performedProps,
	transitionProps,
	eventMap
});

export default Sprite;
