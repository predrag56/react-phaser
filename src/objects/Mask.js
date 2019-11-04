import Phaser from 'phaser';
import { omit } from 'lodash';
import emptyObject from 'fbjs/lib/emptyObject';
import TransparentGameObject from './GameObject/Transparent';
import TYPES from '../types';

const performedProps = {};

const allowedProps = [];

class Mask extends TransparentGameObject {
	preRegister(scene, parent) {
		// const { animations } = this.props;

		// this.tweenQueue = [];
		// this.animationPool = {};

		window.mask = this;

		// this.animationsConfig = this.prepareConfig(animations);
	}
}

Object.assign(Mask.prototype, {
	shouldStop: false,
	type: TYPES.MASK,
	performedProps,
	allowedProps
});

export default Mask;
