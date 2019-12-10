import Phaser from 'phaser';
import { pick, omit } from 'lodash';
import { insertBefore } from './utils';

const IS_REGISTERED = Symbol('Scene.isRegistered');
const POOL = Symbol('Scene.pool');
const HOOKS = Symbol('Scene.hooks');
const ASSETS = Symbol('Scene.assets');
const PROPS = Symbol('Scene.props');
export const UPDATE = Symbol('Scene.update');

const SCENE_HOOKS = ['init', 'preload', 'create', 'beforecreate', 'update'];

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
		const { assets = [], ...rest } = props;
		const parsedProps = {};

		for (let key in rest) {
			const value = rest[key];
			const isEvent = key.slice(0, 2) === 'on';
			if (isEvent) {
				key = key.substr(2).toLowerCase();
			}

			parsedProps[key] = value;
		}

		const sceneProps = omit(parsedProps, SCENE_HOOKS);
		sceneProps.key = props.name;
		const hooks = pick(parsedProps, SCENE_HOOKS);

		super(sceneProps);
		this.key = props.name;
		this[ASSETS] = assets;
		this[HOOKS] = hooks;
		this[PROPS] = props;

		this.update = hooks.update || this.update;
	}

	[UPDATE](newProps, oldProps) {
		if (!this[IS_REGISTERED]) return;

		for (const key in newProps) {
			const value = newProps[key];
			if (oldProps && oldProps[key] === value) {
				continue;
			}

			performedProps[key] && performedProps[key](this, newProps);
		}
		this[PROPS] = newProps;
	}

	register(game) {
		game.scene.add(this.key, this);
		this.game = game;
		this[IS_REGISTERED] = true;

		this[UPDATE](this[PROPS]);
	}

	init(...args) {
		const { init } = this[HOOKS];

		init && init.call(this, this, ...args);
	}

	preload(...args) {
		this[ASSETS].forEach(([type, ...assetArgs]) => {
			this.load[type](...assetArgs);
		});

		const { preload } = this[HOOKS];
		preload && preload.call(this, this, ...args);
	}

	create(...args) {
		const pool = this[POOL];
		const { create, beforecreate } = this[HOOKS];

		beforecreate && beforecreate.call(this, this, ...args);

		for (let i = 0, l = pool.length; i < l; i++) {
			if (!pool[i].destroyed) {
				pool[i].register(this);
			}
		}

		create && create.call(this, this, ...args);
	}
}
