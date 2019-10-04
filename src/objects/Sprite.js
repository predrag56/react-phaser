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

class Sprite extends GameObject {
	register(scene) {
		const { x, y, texture, frame } = this.props;
		this.scene = scene;
		this.instance = new Phaser.GameObjects.Sprite(scene, x, y, texture, frame);
		this.registered = true;
		scene.add.displayList.add(this.instance);
		scene.add.updateList.add(this.instance);
		this.registerTransitions();
		this.registerAnimations();
		this.update(this.props);

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
				frames = anims.generateFrameNumbers(texture, generateFrameNames);
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

		if (animations && Array.isArray(animations)) {
			animations.forEach((config) => {
				var anim;
				var key = this.getAnimationName(config.key);
				config.key = key;

				if (key) {
					anim = anims.get(key);
					if (anim) {
						console.warn(`Animation "${key}" is already registered in this Scene "${sceneKey}"`);
						return;
					}

					anim = new Phaser.Animations.Animation(anims, key, this.prepareAnimationConfig(config));
					anims.anims.set(key, anim);
					anims.emit(Phaser.Animations.Events.ADD_ANIMATION, key, anim);
				}
			});
		}
	}
}

Object.assign(Sprite.prototype, {
	texture: '',
	type: TYPES.SPRITE,
	allowedProps,
	performedProps,
	transitionProps
});

export default Sprite;
