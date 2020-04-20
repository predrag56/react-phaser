import TYPES from '../../types';
import GameObject from '../GameObject';
import { pause, width, height, origin } from '../GameObject/performedProps';

const allowedProps = [
	'x',
	'y',
	'z',
	'texture',
	'alpha',
	'angle',
	'scale',
	'tint',
	'visible',
	'origin',
	'mute',
	'volume',
	'play',
	'src',
	'controls',
	'loop',
	'muted',
	'playsInline',
	'crossOrigin',
	'playbackTimeChangeEventEnable',
	'exit'
];

const eventMap = {
	onPlay: 'play',
	onStop: 'stop',
	onCreated: 'created',
	onComplete: 'complete',
	onUnlocked: 'unlocked',
	onLoop: 'loop',
	onSeeking: 'seeking',
	onSeeked: 'seeked',
	onTimeout: 'timeout',
	onError: 'error'
};

const performedProps = {
	width,
	height,
	play: (inst, { play }) => {
		if (play) {
			inst.play();
		} else {
			inst.stop();
		}
	},
	muted: (inst, { muted }) => {
		inst.setMute(muted);
	},
	pause,
	origin
};

class Video extends GameObject {
	register(scene) {
		const { x, y, texture } = this.props;
		this.scene = scene;
		this.instance = scene.add.video(x, y, texture);
		this.registered = true;
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Video.prototype, {
	texture: '',
	type: TYPES.VIDEO,
	allowedProps,
	performedProps,
	eventMap
});

export default Video;
