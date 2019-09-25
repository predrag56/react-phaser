import { pick } from 'lodash';
import shortid from 'shortid';
import { insertBefore } from '../utils';
import { addToScene, insertBeforeToScene } from './Scene';
const allowedProps = [];
const defaultProps = {};
const performedProps = {};

class GameObject {
  pool = [];

  scenePool = [];

  constructor(props) {
    this.props = props;
    this.id = shortid.generate();
  }

  register(scene) {
    console.warn('Register should be overwritten');
  }

  add(child) {
    if (this.registered) {
      const instance = child.register(this.scene);
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

  update(newProps, oldProps) {
    const props = {
      ...this.defaultProps,
      ...pick(newProps, this.allowedProps),
    };

    const { instance } = this;
    if (!this.registered) return;

    for (const key in props) {
      const value = props[key];

      if (oldProps && oldProps[key] === value) {
        continue;
      }

      if (this.performedProps[key]) {
        this.performedProps[key](instance, props, this);
      } else {
        instance[key] = value;
      }
    }
    this.props = newProps;
  }

  destroy() {
    this.instance.destroy();
    delete this.instance;
  }
}

Object.assign(GameObject.prototype, {
  instance: null,
  registered: false,
  performedProps,
  allowedProps,
});

export default GameObject;
