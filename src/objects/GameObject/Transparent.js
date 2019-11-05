import Phaser from 'phaser';
import { noop } from 'lodash';
import GameObject from './';
import Scene, { insertBeforeToScene, addToScene } from '../../Scene';
import { insertBefore } from '../../utils';

class Transparent extends GameObject {
	register(scene, parent) {
		this.scene = scene;
		this.parent = parent;

		this.preRegister(scene, parent);

		this.registered = true;
		this.registerChildren();
		this.update(this.props);

		this.postRegister(scene, parent);

		return this.getChildren();
	}

	add(child) {
		if (this.registered) {
			const instance = child.register(this.scene);
			this.children.push(child);
			this.parent.add(instance);
			this.pool.push(child);
		} else {
			this.pool.push(child);
		}
	}

	insertBefore(child, beforeChild) {
		const { parent } = this;

		this.add(child);

		if (parent instanceof Scene) {
			insertBeforeToScene(parent, child.instance, beforeChild.instance);
		} else {
			insertBefore(parent.instance.list, child.instance, beforeChild.instance);
		}
	}

	registerChildren() {
		const { children, pool, scenePool, scene } = this;

		for (const elem of pool) {
			const child = elem.register(this.scene);
			children.push(elem);
		}

		for (const child of scenePool) {
			addToScene(scene, child);
		}
	}
}

Object.assign(Transparent.prototype, {
	preRegister: noop,
	postRegister: noop
});

export default Transparent;
