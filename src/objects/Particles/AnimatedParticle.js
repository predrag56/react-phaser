import Phaser from 'phaser';
import Particle from 'phaser/src/gameobjects/particles/Particle';

class AnimatedParticle extends Particle {
	constructor(scene, animationName, emitter) {
		super(emitter);
		this.t = 0;
		this.i = 0;
		this.scene = scene;
		this.anims = new Phaser.GameObjects.Components.Animation(this);
		this.anims.play(animationName);
	}

	/* eslint-disable class-methods-use-this */
	emit() {}

	/* eslint-disable class-methods-use-this */
	setSizeToFrame() {}

	/* eslint-disable class-methods-use-this */
	updateDisplayOrigin() {}

	update(delta, step, processors) {
		const result = super.update(delta, step, processors);
		this.t += delta;
		this.anims.update(this.t, delta);
		return result;
	}
}

export default AnimatedParticle;
