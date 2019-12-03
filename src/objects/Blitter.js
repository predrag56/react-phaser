import GameObject from './GameObject';
import TYPES from '../types';

const allowedProps = ['x', 'y', 'frame', 'data'];

const performedProps = {
	data: (inst, { data }) => {
		inst.clear();
		data.forEach(({ x, y, frame, visible, index, reset, alpha, flip }) => {
			if (reset) {
				return;
			}
			const bob = inst.create(x, y, frame, visible, index);
			if (alpha) {
				bob.setAlpha(alpha);
			}
			if (flip) {
				bob.setFlip(flip.x, flip.y);
			}
		});
	}
};

class Blitter extends GameObject {
	register(scene) {
		const { x, y, texture, frame } = this.props;
		this.scene = scene;
		this.instance = scene.add.blitter(x, y, texture, frame);
		this.registered = true;
		this.update(this.props);
		this.postRegister();

		return this.instance;
	}
}

Object.assign(Blitter.prototype, {
	type: TYPES.BLITTER,
	performedProps,
	allowedProps
});

export default Blitter;
