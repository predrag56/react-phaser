import GameObject from './GameObject';
import { setFillStyle, stroke, interactive, origin } from './GameObject/performedProps';
import GetAABB from 'phaser/src/geom/polygon/GetAABB';
import GeomPolygon from 'phaser/src/geom/polygon/Polygon';
import TYPES from '../types';

const allowedProps = [
	'x',
	'y',
	'z',
	'points',
	'innerRadius',
	'outerRadius',
	'fillColor',
	'alpha',
	'origin',
	'angle',
	'strokeWidth',
	'strokeColor',
	'strokeAlpha',
	'smoothness',
	'scale',
	'visible',
	'interactive',
	'stroke'
];

const performedProps = {
	interactive,
	fillColor: setFillStyle,
	origin,
	stroke
};

class Star extends GameObject {
	register(scene) {
		const { x, y, points, innerRadius, outerRadius, fillColor } = this.props;
		this.scene = scene;
		this.instance = scene.add.star(x, y, points, innerRadius, outerRadius, fillColor);
		this.registered = true;
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Star.prototype, {
	type: TYPES.STAR,
	performedProps,
	allowedProps
});

export default Star;
