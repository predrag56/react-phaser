import Events from 'phaser/src/input/events';
import emptyObject from 'fbjs/lib/emptyObject';
import invariant from 'fbjs/lib/invariant';
import { pick, noop } from 'lodash';
import { insertBefore, shortId } from '../../utils';
import { addToScene } from '../../Scene';

const allowedProps = [];
const defaultProps = {
	origin: [0, 0],
	visible: true
};
const performedProps = {};
const transitionProps = [];
const defaultEventMap = {
	onClick: Events.POINTER_UP,
	onDrag: Events.DRAG,
	onDragEnd: Events.DRAG_END,
	onDragEnter: Events.DRAG_ENTER,
	onDragLeave: Events.DRAG_LEAVE,
	onDragOver: Events.DRAG_OVER,
	onDragStart: Events.DRAG_START,
	onDrop: Events.DROP,
	onMouseDown: Events.POINTER_DOWN,
	onMouseEnter: Events.POINTER_OVER,
	onMouseLeave: Events.POINTER_OUT,
	onMouseMove: Events.POINTER_MOVE,
	onMouseOut: Events.POINTER_OUT,
	onMouseOver: Events.POINTER_OVER,
	onMouseUp: Events.POINTER_UP,
	onDestroy: Events.DESTROY
};

const getInst = (el) => el.getChildren();

class GameObject {
	pool = [];

	scenePool = [];

	transitionsPool = [];

	children = [];

	constructor(props) {
		this.props = props;
		this.id = shortId.randomUUID(5);
		this.interactive = props.interactive;

		this.fullEventMap = {
			...defaultEventMap,
			...this.eventMap
		};

		this.allowedDefaultProps = {
			...pick(defaultProps, this.allowedProps),
			...this.defaultProps
		};

		this.eventNames = Object.keys(this.fullEventMap);
	}

	postRegister() {
		this.destroyed = false;
	}

	getChildren() {
		const children = [];

		if (this.instance) {
			children.push(this.instance);
		}

		if (this.children) {
			children.push(...this.children.map((el) => el.getChildren()).reduce((acc, el) => acc.concat(el), []));
		}

		return children.filter((el) => el);
	}

	register() {
		invariant(`Register method of ${this} should be overwritten`);
	}

	add(child) {
		if (this.registered) {
			const instance = child.register(this.scene, this);
			this.instance.add(instance);
		} else {
			this.pool.push(child);
		}
	}

	addToScene(child) {
		if (this.registered) {
			addToScene(this.scene, child);
		} else {
			this.scenePool.push(child);
		}
	}

	insertBefore(child, beforeChild) {
		this.add(child);
		insertBefore(this.instance.list, child.instance, beforeChild.instance);
	}

	registerChildren() {
		const { pool, scenePool, scene } = this;

		for (const elem of pool) {
			const child = elem.register(this.scene);
			this.instance.add(child);
		}

		for (const child of scenePool) {
			addToScene(scene, child);
		}
	}

	forceUpdate(props) {
		this.update(props, emptyObject);
	}

	/* eslint-disable complexity */
	update(newProps, oldProps) {
		this.props = {
			...this.allowedDefaultProps,
			...newProps
		};

		if (!this.registered) return;

		if (!this.initialUpdated) {
			this.initialUpdated = true;
			this.update(newProps, null);
			return;
		}

		if (!this.scene.sys.isActive()) return;

		if (oldProps && newProps.immutable) return;

		const { instance, fullEventMap, interactive } = this;

		const props = {
			...this.allowedDefaultProps,
			...pick(newProps, this.allowedProps),
			...pick(newProps, this.eventNames)
		};

		for (const key in props) {
			const value = props[key];
			const oldValue = oldProps && oldProps[key];

			if (oldProps && oldValue === value) {
				continue;
			}

			if (typeof value === 'object' && JSON.stringify(value) === JSON.stringify(oldValue)) {
				continue;
			}

			if (interactive && fullEventMap[key]) {
				const eventName = fullEventMap[key];
				if (oldProps && oldValue) {
					instance.removeListener(eventName, oldValue, instance);
				}
				if (value) {
					instance.addListener(eventName, value, instance);
				}
				continue;
			}

			if (this.hasTransition(key)) {
				this.triggerTransitionTween(key, value, oldValue);
				continue;
			}

			if (this.performedProps[key]) {
				this.performedProps[key](instance, props, this);
				continue;
			}

			if (instance) {
				instance[key] = value;
			}
		}
	}
	/* eslint-enable complexity */

	hasTransition(key) {
		return this.transitionProps.indexOf(key) > -1 && this.transitionsConfig && this.transitionsConfig[key];
	}

	registerTransitions() {
		this.transitionsConfig = this.parseTransitionsProps();
	}

	parseTransitionsProps() {
		const { transition } = this.props;
		if (!transition) return null;

		if (typeof transition === 'object') {
			return transition;
		}

		if (typeof transition === 'string') {
			return transition
				.split(',')
				.map((elem) =>
					elem
						.trim()
						.split(' ')
						.map((el) => el.trim())
				)
				.reduce((acc, [key, ...params]) => {
					acc[key] = params;

					return acc;
				}, {});
		}

		return null;
	}

	triggerTransitionTween(key, value, oldValue) {
		var config = this.transitionsConfig[key];

		this.removeTransitionTween(key);

		if (Array.isArray(config)) {
			const [duration, ease] = config;

			config = {
				duration,
				ease
			};
		}

		const tween = this.scene.add.tween({
			targets: this.instance,
			props: {
				[key]: {
					value,
					...config
				}
			},
			onComplete: () => this.removeTransitionTween(key)
		});

		this.transitionsPool[key] = tween;
	}

	removeTransitionTween(key) {
		const tween = this.transitionsPool[key];

		if (!tween) {
			return;
		}

		if (tween.isPlaying()) {
			tween.stop();
		}
		delete this.transitionsPool[key];
	}

	destroy() {
		this.destroyed = true;
		if (this.instance) {
			this.instance.destroy();
			delete this.instance;
		}
	}
}

Object.assign(GameObject.prototype, {
	instance: null,
	registered: false,
	performedProps,
	allowedProps,
	transitionProps,
	preRegister: noop,
	postRegister: noop,
	defaultProps: emptyObject,
	eventMap: emptyObject
});

export default GameObject;
