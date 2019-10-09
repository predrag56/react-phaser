import GameObject from './GameObject';
import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';
import { texture as textureFn } from './GameObject/performedProps';
import TYPES from '../types';

const allowedProps = ['texture', 'frame', 'pause', 'start', 'animation'];

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
		const { texture } = this.props;
		this.scene = scene;
		this.instance = scene.add.particles(texture);
		this.emitter = this.instance.createEmitter();
		this.registered = true;
		this.textureName = texture;
		this.update(this.props);
		return this.instance;
	}

	update(newProps = emptyObject, oldProps = emptyObject) {
		const newConfig = {
			...newProps.config,
			frame: newProps.frame
		};

		const oldConfig = {
			...oldProps.config,
			frame: oldProps.frame
		};

		if (JSON.stringify(newConfig) !== JSON.stringify(oldConfig)) {
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

	registerAnimation() {
		const { anims, key: sceneKey } = this.scene;
		const { animation } = this.props;

		if (!animation) {
			return;
		}

		const key = this.getAnimationName(this.textureName);
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
}

Object.assign(Particles.prototype, {
	type: TYPES.PARTICLES,
	performedProps,
	allowedProps
});

export default Particles;
