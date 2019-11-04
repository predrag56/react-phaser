import Phaser from 'phaser';
import GameObject from './GameObject';
import Scene, { insertBeforeToScene } from '../Scene';
import { insertBefore } from '../utils';
import TYPES from '../types';
import emptyObject from 'fbjs/lib/emptyObject';
import { omit } from 'lodash';

const performedProps = {
	play: (inst, { play }, object) => {
		if (play) {
			object.play(play);
		} else {
			object.stop();
		}
	}
};

const allowedProps = ['play'];

const getInst = (el) => el.instance;

class Mask extends GameObject {
	register(scene, parent) {
		const { animations } = this.props;
		this.scene = scene;

		window.tween = this;

		this.parent = parent;
		this.children = [];
		this.tweenQueue = [];
		this.animationPool = {};

		this.animationsConfig = this.prepareConfig(animations);
		this.registered = true;
		this.registerChildren();
		this.update(this.props);

		return this.getTargets();
	}
}

Object.assign(Mask.prototype, {
	shouldStop: false,
	type: TYPES.MASK,
	performedProps,
	allowedProps
});

export default Mask;
