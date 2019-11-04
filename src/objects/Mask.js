import Phaser from 'phaser';
import invariant from 'fbjs/lib/invariant';
import TransparentGameObject from './GameObject/Transparent';
import Components from '../ComponentsMap';
import TYPES from '../types';

const GeomNodes = {
	[TYPES.RECTANGLE]: (scene, { x, y, width, height, fillColor, alpha }) => {
		const shape = scene.make.graphics();
		shape.x = x;
		shape.y = y;
		shape.fillStyle(fillColor, alpha);
		shape.fillRect(0, 0, width, height);
		return shape;
	},
	[TYPES.ROUNDEDRECTANGLE]: (scene, { x, y, width, height, radius, fillColor, alpha }) => {
		const shape = scene.make.graphics();
		shape.x = x;
		shape.y = y;
		shape.fillStyle(fillColor, alpha);
		shape.fillRoundedRect(0, 0, width, height, radius);
		return shape;
	},
	[TYPES.TRIANGLE]: (scene, { x, y, x1, y1, x2, y2, x3, y3, fillColor, alpha, smoothness }) => {
		const shape = scene.make.graphics();
		shape.x = x;
		shape.y = y;
		shape.fillStyle(fillColor, alpha);
		shape.fillTriangle(x1, y1, x2, y2, x3, y3);
		return shape;
	},
	[TYPES.CIRCLE]: (scene, { x, y, radius, fillColor, alpha, smoothness }) => {
		const shape = scene.make.graphics();
		shape.x = x;
		shape.y = y;
		shape.fillStyle(fillColor, alpha);
		shape.fillCircle(0, 0, radius, smoothness);
		return shape;
	},
	[TYPES.ELLIPSE]: (scene, { x, y, width, height, fillColor, alpha, smoothness }) => {
		const shape = scene.make.graphics();
		shape.x = x;
		shape.y = y;
		shape.fillStyle(fillColor, alpha);
		shape.fillEllipse(0, 0, width, height, smoothness);
		return shape;
	}
};

class Mask extends TransparentGameObject {
	preRegister(scene, parent) {
		const { type, inverse, ...props } = this.props;

		this.createMaskObject(scene, type, props);

		invariant(this.shape, `React-Phaser-Bindings: Unsupported Mask type: ${type}`);
	}

	postRegister() {
		const children = this.getChildren();

		for (const child of children) {
			child.setMask(this.mask);
		}
	}

	createMaskObject(scene, type, props) {
		if (GeomNodes[type]) {
			this.shape = GeomNodes[type](scene, props);
			this.mask = this.shape.createGeometryMask();
		}
	}
}

Object.assign(Mask.prototype, {
	shouldStop: false,
	type: TYPES.MASK
});

export default Mask;
