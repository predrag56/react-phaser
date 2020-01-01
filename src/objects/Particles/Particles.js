import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';
import GameObject from '../GameObject';
import { texture as textureFn } from '../GameObject/performedProps';
import TYPES from '../../types';
import AnimatedParticle from './AnimatedParticle';

const allowedProps = ['texture', 'frame', 'pause', 'start'];

const performedProps = {
	texture: textureFn,
	frame: (inst, { frame }, { emitter }) => emitter.setFrame(frame),
	pause: (inst, { pause }, { emitter }) => {
		if (pause) {
			emitter.pause();
		} else {
			emitter.resume();
		}
	},
	start: (inst, { start }, { emitter }) => {
		if (start) {
			emitter.start();
		} else {
			emitter.stop();
		}
	}
};

class Particles extends GameObject {
	register(scene) {
		const { texture, animation } = this.props;
		this.scene = scene;
		this.instance = scene.add.particles(texture);
		this.emitter = this.instance.createEmitter();
		this.registered = true;
		this.textureName = texture;

		const animName = this.getAnimationName();
		this.getAnimatedParticleClass = function(emitter) {
			return new AnimatedParticle(scene, animName, emitter);
		};

		if (animation) {
			this.isAnimated = true;
			this.registerAnimation();
		}

		this.update(this.props);

		return this.instance;
	}

	update(newProps = emptyObject, oldProps = emptyObject) {
		oldProps = oldProps || {};
		const newConfig = {
			...newProps.config,
			frame: newProps.frame,
			animation: undefined
		};

		const oldConfig = {
			...oldProps.config,
			frame: oldProps.frame,
			animation: undefined
		};

		if (JSON.stringify(newConfig) !== JSON.stringify(oldConfig)) {
			if (this.isAnimated) {
				newConfig.particleClass = this.getAnimatedParticleClass;
			}

			this.emitter.fromJSON(newConfig);
		}

		GameObject.prototype.update.call(this, newProps, oldProps);
	}

	add(child) {
		invariant('React-Phaser-Bindings: Unsupported Particles child component', this, child);
	}

	addToScene(child) {
		invariant('React-Phaser-Bindings: Unsupported Particles child component', this, child);
	}

	insertBefore(child) {
		invariant('React-Phaser-Bindings: Unsupported Particles child component', this, child);
	}

	destroy() {
		this.emitter.stop();
		this.instance.destroy();
		delete this.instance;
	}

	getAnimationName() {
		return `${this.id}_${this.textureName}`;
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

	registerAnimation() {
		const { anims, key: sceneKey } = this.scene;
		const { animation } = this.props;

		if (!animation) {
			return;
		}

		const key = this.getAnimationName();
		let anim = anims.get(key);

		if (anim) {
			console.warn(`Animation "${key}" is already registered in this Scene "${sceneKey}"`);
			return;
		}

		const config = {
			key,
			...animation
		};

		anim = new Phaser.Animations.Animation(anims, key, this.prepareAnimationConfig(config));
		anims.anims.set(key, anim);
		anims.emit(Phaser.Animations.Events.ADD_ANIMATION, key, anim);
	}

	postDestroy() {
		this.scene.anims.remove(this.getAnimationName());
	}
}

Object.assign(Particles.prototype, {
	isAnimated: false,
	type: TYPES.PARTICLES,
	performedProps,
	allowedProps
});

export default Particles;
