import GameObject from './GameObject';
import TYPES from '../types';

const performedProps = {
	play: (inst, { play, marker }) => {
		if (play) {
			inst.play(marker);
		} else {
			inst.stop();
		}
	},
	pause: (inst, { pause }) => {
		if (pause) {
			inst.pause();
		} else {
			inst.resume();
		}
	},
	delay: (inst, { delay }) => inst.audioPlayDelay(delay)
};

const allowedProps = ['play', 'pause', 'marker', 'mute', 'volume', 'rate', 'detune', 'seek', 'loop', 'delay'];

class Audio extends GameObject {
	register(scene) {
		const { name } = this.props;
		this.scene = scene;
		this.instance = scene.sound.add(name);
		this.registered = true;

		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Audio.prototype, {
	name: '',
	type: TYPES.AUDIO,
	performedProps,
	allowedProps
});

export default Audio;
