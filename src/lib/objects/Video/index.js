import Phaser from 'phaser';
import { pick, get } from 'lodash';
import TYPES from '../../types';
import GameObject from '../GameObject';
import { pause, width, height, origin } from '../GameObject/performedProps';
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

const performedProps = {
  width,
  height,
  play: (inst, { play }) => {
    if (play) {
      inst.play();
    } else {
      inst.pause();
    }
  },
  pause,
  origin
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
  performedProps
});

export default Video;
