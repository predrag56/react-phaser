import Phaser from 'phaser';
import { pick, omit } from 'lodash';
import { insertBefore } from './utils';

const IS_REGISTERED = Symbol('Scene.isRegistered');
const POOL = Symbol('Scene.pool');
const HOOKS = Symbol('Scene.hooks');
const ASSETS = Symbol('Scene.assets');
const PROPS = Symbol('Scene.props');
export const UPDATE = Symbol('Scene.update');

const SCENE_HOOKS = ['onInit', 'onPreload', 'onCreate', 'onBeforeCreate', 'onUpdate'];

const performedProps = {
	active: (inst, { active, name }) => {
		if (active) {
			inst.game.scene.start(name);
		} else {
			inst.game.scene.stop(name);
		}
	},
	pause: (inst, { pause, name }) => {
		if (pause) {
			inst.game.scene.pause(name);
		} else {
			inst.game.scene.resume(name);
		}
	}
};

export const addToScene = (scene, child) => {
	if (scene[IS_REGISTERED]) {
		child.register(scene);
	} else {
		scene[POOL].push(child);
	}
	return child;
};

export const insertBeforeToScene = (scene, child, beforeChild) => {
	addToScene(scene, child);
	insertBefore(scene.sys.displayList.list, child.instance, beforeChild.instance);
	return child;
};

export default class Scene extends Phaser.Scene {
	key = '';

	[POOL] = [];

	[IS_REGISTERED] = false;

	constructor(props) {
		const sceneProps = omit(props, SCENE_HOOKS, 'assets', 'children');
		sceneProps.key = props.name;

		const hooks = pick(props, SCENE_HOOKS);

		super(sceneProps);

		this.key = props.name;
		this[ASSETS] = props.assets;
		this[HOOKS] = pick(hooks, SCENE_HOOKS);
		this[PROPS] = props;
	}

	[UPDATE](newProps, oldProps) {
		if (!this[IS_REGISTERED]) return;

		for (let key in newProps) {
			const value = newProps[key];

			if (oldProps && oldProps[key] === value) continue;

			if (performedProps[key]) {
				performedProps[key](this, newProps);
			}
		}

		this[HOOKS] = pick(newProps, SCENE_HOOKS);
		this[PROPS] = newProps;
	}

	register(game) {
		game.scene.add(this.key, this);
		this.game = game;
		this[IS_REGISTERED] = true;

		this[UPDATE](this[PROPS]);
	}

	init(...args) {
		const { onInit } = this[HOOKS];

		onInit && onInit.call(this, this, ...args);
	}

	preload(...args) {
		const { onPreload } = this[HOOKS];

		if (this[ASSETS]) {
			this[ASSETS].forEach(([type, ...assetArgs]) => {
				this.load[type](...assetArgs);
			});
		}

		onPreload && onPreload.call(this, this, ...args);
	}

	create(...args) {
		const pool = this[POOL];
		const { onCreate, beforecreate } = this[HOOKS];

		beforecreate && beforecreate.call(this, this, ...args);

		for (let i = 0, l = pool.length; i < l; i++) {
			if (!pool[i].destroyed) {
				pool[i].register(this);
			}
		}

		onCreate && onCreate.call(this, this, ...args);
	}

	update(...args) {
		const { onUpdate } = this[HOOKS];

		onUpdate && onUpdate.call(this, this, ...args);
	}
}
