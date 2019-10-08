import GameObject from './GameObject';
import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';
import { texture as textureFn } from './GameObject/performedProps';
import TYPES from '../types';

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
		const { texture } = this.props;
		this.scene = scene;
		this.instance = scene.add.particles(texture);
		this.emitter = this.instance.createEmitter();
		this.registered = true;
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
}

Object.assign(Particles.prototype, {
	type: TYPES.PARTICLES,
	performedProps,
	allowedProps
});

export default Particles;
