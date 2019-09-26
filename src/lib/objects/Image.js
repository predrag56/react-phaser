import Phaser from 'phaser';
import GameObject from './GameObject';
import TYPES from '../types';

const allowedProps = [
  'texture',
  'frame',
  'x',
  'y',
  'z',
  'origin',
  'alpha',
  'angle',
  'scale',
  'tint',
  'visible',
  'interactive'
];

const defaultProps = {
  origin: [0, 0]
};

const performedProps = {
  interactive: (inst, { interactive }) => {
    if (interactive) {
      inst.setInteractive();
    } else {
      inst.disableInteractive();
    }
  },
  frame: (inst, { frame }) => inst.setFrame(frame),
  texture: (inst, { texture, frame }) => inst.setTexture(texture, frame),
  width: (inst, { width }) => inst.displayWidth(width),
  height: (inst, { height }) => inst.displayHeight(height),
  origin: (inst, { origin }) => inst.setOrigin(...origin)
};

class Image extends GameObject {
  register(scene) {
    const { x, y, texture, frame } = this.props;
    this.scene = scene;
    this.instance = new Phaser.GameObjects.Image(scene, x, y, texture, frame);
    this.registered = true;
    scene.add.displayList.add(this.instance);
    this.update(this.props);
    window.img = this.instance;
    return this.instance;
  }

  onMouseDown() {
    this.pressed = true;
  }

  onMouseUp() {
    this.pressed = false;
  }
}

Object.assign(Image.prototype, {
  texture: '',
  type: TYPES.IMAGE,
  performedProps,
  allowedProps,
  defaultProps
});

export default Image;
