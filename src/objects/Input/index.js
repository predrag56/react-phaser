import TYPES from '../../types';
import GameObject from '../GameObject';
import InputObject from './InputObject';

const allowedProps = ['x', 'y', 'width', 'height', 'placeholder', 'value', 'readonly', 'style'];

const performedProps = {};

const eventMap = {
	onInput: 'input',
	onChange: 'change',
	onDbClick: 'dblclick',
	onFocus: 'focus',
	onBlur: 'blur'
};

class Input extends GameObject {
	register(scene) {
		this.scene = scene;
		this.instance = new InputObject(scene, this.props);
		this.registered = true;
		scene.add.existing(this.instance);
		this.update(this.props);
		window.input = this;
		return this.instance;
	}
}

Object.assign(Input.prototype, {
	type: TYPES.INPUT,
	performedProps,
	allowedProps,
	eventMap
});

export default Input;
