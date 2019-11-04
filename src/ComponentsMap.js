import TYPES from './types';

import Scene from './Scene';
import Container from './objects/Container';
import Sprite from './objects/Sprite';
import Image from './objects/Image';
import Audio from './objects/Audio';
import Video from './objects/Video';
import Text from './objects/Text';
import BitmapText from './objects/BitmapText';
import Circle from './objects/Circle';
import Ellipse from './objects/Ellipse';
import Triangle from './objects/Triangle';
import Rectangle from './objects/Rectangle';
import Polygon from './objects/Polygon';
import Star from './objects/Star';
import Zone from './objects/Zone';
import Particles from './objects/Particles';
import Tween from './objects/Tween';
import Blitter from './objects/Blitter';
import Input from './objects/Input';
// import Mask from './objects/Mask';

export default {
	[TYPES.SCENE]: Scene,
	[TYPES.CONTAINER]: Container,
	[TYPES.SPRITE]: Sprite,
	[TYPES.IMAGE]: Image,
	[TYPES.AUDIO]: Audio,
	[TYPES.VIDEO]: Video,
	[TYPES.TEXT]: Text,
	[TYPES.BITMAPTEXT]: BitmapText,
	[TYPES.CIRCLE]: Circle,
	[TYPES.ELLIPSE]: Ellipse,
	[TYPES.TRIANGLE]: Triangle,
	[TYPES.RECTANGLE]: Rectangle,
	[TYPES.POLYGON]: Polygon,
	[TYPES.STAR]: Star,
	[TYPES.ZONE]: Zone,
	[TYPES.PARTICLES]: Particles,
	[TYPES.TWEEN]: Tween,
	[TYPES.BLITTER]: Blitter,
	[TYPES.INPUT]: Input
};
