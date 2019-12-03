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
	'fillColor',
	'alpha',
	'angle',
	'origin',
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
	stroke,
	points: (inst, { points }) => {
		inst.geom = new GeomPolygon(points);
		const bounds = GetAABB(inst.geom);
		inst.setSize(bounds.width, bounds.height);
		inst.updateData();
	}
};

class Polygon extends GameObject {
	register(scene) {
		const { x, y, points, fillColor } = this.props;
		this.scene = scene;
		this.instance = scene.add.polygon(x, y, points, fillColor);
		this.registered = true;
		this.update(this.props);

		return this.instance;
	}
}

Object.assign(Polygon.prototype, {
	type: TYPES.POLYGON,
	performedProps,
	allowedProps
});

export default Polygon;
