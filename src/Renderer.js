import Phaser from 'phaser';
import Reconciler from 'react-reconciler';
import invariant from 'fbjs/lib/invariant';
import emptyObject from 'fbjs/lib/emptyObject';
import {
	unstable_now as now,
	unstable_scheduleCallback as scheduleDeferredCallback,
	unstable_cancelCallback as cancelDeferredCallback
} from 'scheduler';
import { version, name } from '../package.json';

import TYPES from './types';
import Scene, { addToScene, insertBeforeToScene, UPDATE } from './Scene';
import Container from './objects/Container';
import Sprite from './objects/Sprite';
import Image from './objects/Image';
import Audio from './objects/Audio';
import Video from './objects/Video';
import Text from './objects/Text';
import BitmapText from './objects/BitmapText';
import Zone from './objects/Zone';

/* eslint-disable no-unused-vars */
const PhaserRenderer = Reconciler({
	appendInitialChild(parent, child) {
		if (parent instanceof Scene) {
			addToScene(parent, child);
			return;
		}

		if (child instanceof Audio) {
			parent.addToScene(child);
			return;
		}

		parent.add(child);
	},

	appendChild(parent, child) {
		if (parent instanceof Scene) {
			addToScene(parent, child);
			return;
		}

		if (child instanceof Audio) {
			parent.addToScene(child);
			return;
		}

		parent.add(child);
	},

	insertBefore(parent, child, beforeChild) {
		invariant(child !== beforeChild, 'React-Phaser-Bindings: Can not insert node before itself');

		if (parent instanceof Scene) {
			insertBeforeToScene(parent, child, beforeChild);
			return;
		}

		if (child instanceof Audio) {
			parent.addToScene(child);
			return;
		}

		parent.insertBefore(child, beforeChild);
	},

	appendChildToContainer(game, child) {
		if (child instanceof Phaser.Scene) {
			child.register(game);
		}
	},

	insertInContainerBefore(parentInstance, child, beforeChild) {
		invariant(child !== beforeChild, 'React-Phaser-Bindings: Can not insert node before itself');
	},

	createInstance(type, props, scope) {
		switch (type) {
			case TYPES.SCENE:
				return new Scene(props);
			case TYPES.CONTAINER:
				return new Container(props);
			case TYPES.IMAGE:
				return new Image(props);
			case TYPES.SPRITE:
				return new Sprite(props);
			case TYPES.TEXT:
				return new Text(props);
			case TYPES.BITMAPTEXT:
				return new BitmapText(props);
			case TYPES.AUDIO:
				return new Audio(props);
			case TYPES.VIDEO:
				return new Video(props);
			case TYPES.ZONE:
				return new Zone(props);
			default:
				return invariant('React-Phaser-Bindings: Unsupported component type');
		}
	},

	createTextInstance(text, rootContainerInstance, paperScope) {
		if (typeof text === 'string' || typeof text === 'number') {
			return text;
		}

		return undefined;
	},

	finalizeInitialChildren(instance, type, props, rootContainerInstance) {
		return false;
	},

	getPublicInstance(instance) {
		return instance;
	},

	prepareForCommit(rootContainerInstance) {},

	prepareUpdate(instance, type, oldProps, newProps) {
		return true;
	},

	resetAfterCommit(rootContainerInstance) {},

	resetTextContent(instance) {},

	shouldDeprioritizeSubtree(type, props) {
		return false;
	},

	getRootHostContext() {
		return emptyObject;
	},

	getChildHostContext() {
		return emptyObject;
	},

	isPrimaryRenderer: false,
	supportsMutation: true,
	supportsHydration: false,
	supportsPersistence: false,

	scheduleTimeout: setTimeout,
	cancelTimeout: clearTimeout,
	noTimeout: -1,

	now,
	scheduleDeferredCallback,
	cancelDeferredCallback,

	shouldSetTextContent(type, props) {
		return false;
	},

	removeChild(parentInstance, child) {
		if (!(child instanceof Phaser.Scene)) {
			child.destroy();
		}
	},

	removeChildFromContainer(parentInstance, child) {},
	commitTextUpdate(textInstance, oldText, newText) {},
	commitMount(instance, type, newProps) {},

	commitUpdate(instance, updatePayload, type, oldProps, newProps, scope) {
		switch (type) {
			case TYPES.SCENE:
				instance[UPDATE](newProps, oldProps);
				break;
			default:
				instance.update(newProps, oldProps);
				break;
		}
	},

	hideInstance(instance) {},
	hideTextInstance(textInstance) {},
	unhideInstance(instance, props) {},
	unhideTextInstance(textInstance, text) {}
});

PhaserRenderer.injectIntoDevTools({
	findFiberByHostInstance: () => null,
	bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
	rendererPackageName: name,
	version
});
/* eslint-enable no-unused-vars */

export default PhaserRenderer;
