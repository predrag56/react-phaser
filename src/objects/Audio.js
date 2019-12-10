import GameObject from './GameObject';
import { pause } from './GameObject/performedProps';
import TYPES from '../types';

const allowedProps = ['play', 'pause', 'marker', 'mute', 'volume', 'rate', 'detune', 'seek', 'loop', 'delay'];

const performedProps = {
	play: (inst, { play, marker }) => {
		if (play) {
			inst.play(marker);
		} else {
			inst.stop();
		}
	},
	pause,
	delay: (inst, { delay }) => inst.audioPlayDelay(delay)
};

class Audio extends GameObject {
	register(scene) {
		const { name } = this.props;
		this.scene = scene;
		this.preRegister();
		this.instance = scene.sound.add(name);
		this.registered = true;
		this.update(this.props);
		this.postRegister();

		return this.instance;
	}
}

Object.assign(Audio.prototype, {
	type: TYPES.AUDIO,
	performedProps,
	allowedProps
});

export default Audio;
