import Phaser from 'phaser';
import { pick, get } from 'lodash';
import TYPES from '../../types';
import GameObject from '../GameObject';
import VideoObject from './VideoObject';

const allowedProps = [
  'x',
  'y',
  'z',
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
  'playbackTimeChangeEventEnable'
];

const defaultProps = {
  origin: [0, 0]
};

const performedProps = {
  width: (inst, { width }) => inst.resize(width, inst.height),
  height: (inst, { height }) => inst.resize(inst.width, height),
  play: (inst, { play }) => {
    if (play) {
      inst.play();
    } else {
      inst.pause();
    }
  },
  pause: (inst, { pause }) => {
    if (pause) {
      inst.pause();
    } else {
      inst.resume();
    }
  },
  origin: (inst, { origin }) => inst.setOrigin(...origin)
};

class Video extends GameObject {
  register(scene) {
    this.scene = scene;
    this.instance = new VideoObject(scene, this.props);
    this.registered = true;
    scene.add.existing(this.instance);
    this.update(this.props);
    return this.instance;
  }
}

Object.assign(Video.prototype, {
  texture: '',
  type: TYPES.VIDEO,
  allowedProps,
  performedProps,
  defaultProps
});

export default Video;
