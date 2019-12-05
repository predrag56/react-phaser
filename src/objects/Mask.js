import Phaser from 'phaser';
import invariant from 'fbjs/lib/invariant';
import { omit, pick } from 'lodash';
import TransparentGameObject from './GameObject/Transparent';
import Components from '../ComponentsMap';
import TYPES from '../types';

const maskProps = ['x', 'y', 'z', 'scale', 'inverse'];

const performedProps = {
	inverse: (shape, mask, { inverse }) => {
		mask.invertAlpha = inverse;
	}
};

const isGeomShape = (type) => !!drawGeomShapes[type];

const getShapeType = (type) => {
	if (drawGeomShapes[type]) {
		return 'geometry';
	}
	return 'bitmap';
};

const fillColor = 0x000000;

const drawGeomShapes = {
	[TYPES.RECTANGLE]: (shape, { x, y, width, height, fillColor, alpha }) => {
		shape.fillStyle(fillColor, alpha);
		shape.fillRect(0, 0, width, height);
	},
	[TYPES.ROUNDEDRECTANGLE]: (shape, { x, y, width, height, radius, alpha }) => {
		shape.fillStyle(fillColor, alpha);
		shape.fillRoundedRect(0, 0, width, height, radius);
	},
	[TYPES.TRIANGLE]: (shape, { x, y, x1, y1, x2, y2, x3, y3, alpha, smoothness }) => {
		shape.fillStyle(fillColor, alpha);
		shape.fillTriangle(x1, y1, x2, y2, x3, y3);
	},
	[TYPES.CIRCLE]: (shape, { x, y, radius, alpha, smoothness }) => {
		shape.fillStyle(fillColor, alpha);
		shape.fillCircle(0, 0, radius, smoothness);
	},
	[TYPES.ELLIPSE]: (shape, { x, y, width, height, alpha, smoothness }) => {
		shape.fillStyle(fillColor, alpha);
		shape.fillEllipse(0, 0, width, height, smoothness);
	}
};

class Mask extends TransparentGameObject {
	postRegister() {
		const children = this.getChildren();

		for (const child of children) {
			child.setMask && child.setMask(this.mask);
		}

		window.Mask = this;
	}

	createShape() {
		const { type, inverse, ...props } = this.props;

		if (isGeomShape(type)) {
			this.shape = this.scene.make.graphics();
			this.mask = this.shape.createGeometryMask();
			return this.shape;
		}

		invariant(this.shape, `React-Phaser-Bindings: Unsupported Mask type: ${type}`);
	}

	drawShape() {
		const { type } = this.props;
		if (isGeomShape(type)) {
			return this.drawGraphics();
		}
	}

	drawGraphics() {
		const { type, inverse, ...props } = this.props;
		this.shape.clear();
		drawGeomShapes[type](this.shape, props);
	}

	updateShape(newProps, oldProps) {
		const { shape, mask } = this;

		const props = pick(newProps, maskProps);

		for (const key in props) {
			const value = props[key];
			const oldValue = oldProps && oldProps[key];

			if (oldProps && oldValue === value) {
				continue;
			}

			if (this.performedProps[key]) {
				this.performedProps[key](shape, mask, props, this);
				continue;
			}

			shape[key] = value;
		}
	}

	update(newProps, oldProps) {
		if (!this.registered) return;

		const pureNewProps = omit(newProps, maskProps, 'children', 'type', 'fillColor');
		const pureOldProps = omit(oldProps, maskProps, 'children', 'type', 'fillColor');

		this.props = newProps;

		if (!this.shape || getShapeType(newProps.type) !== getShapeType(oldProps.type)) {
			this.createShape();
		}

		if (JSON.stringify(pureNewProps) !== JSON.stringify(pureOldProps)) {
			this.drawShape();
		}

		this.updateShape(newProps, oldProps);
	}
}

Object.assign(Mask.prototype, {
	shouldStop: false,
	type: TYPES.MASK,
	performedProps
});

export default Mask;
