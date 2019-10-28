import Phaser from 'phaser';
import { get, isNil } from 'lodash';
import emptyObject from 'fbjs/lib/emptyObject';
const { DOMElement } = Phaser.GameObjects;

import { stopPropagationTouchEvents } from '../../utils/stopPropagation';

const elementProperties = {
	id: undefined,
	placeholder: undefined,
	readonly: false,
	disabled: false,
	spellcheck: false,
	tooltip: '',
	autocomplete: 'off'
};

const styleProperties = {
	align: ['text-align', undefined],
	width: ['width', undefined],
	height: ['height', undefined],
	fontFamily: ['font-family', undefined],
	fontSize: ['font-size', undefined],
	color: ['color', '#ffffff'],
	backgroundColor: ['backgroundColor', 'transparent'],
	borderColor: ['borderColor', 'transparent'],
	outline: ['outline', 'none']
};

/* eslint-disable */
class InputText extends DOMElement {
	constructor(scene, config = emptyObject) {
		config = { ...config };
		const { x = 0, y = 0, type = 'text', tooltip } = config;
		const { autoRound } = scene.scale;
		let { width, height, style = emptyObject } = config;

		style = { ...style, 'box-sizing': 'border-box' };
		if (autoRound) {
			width = Math.floor(width);
			height = Math.floor(height);
		}

		let element;

		if (type === 'textarea') {
			element = document.createElement('textarea');
			element.style.resize = 'none';
		} else {
			element = document.createElement('input');
			element.type = type;
		}

		for (const key in elementProperties) {
			const value = get(config, key, elementProperties[key]);
			if (value !== undefined) {
				element[key] = value;
			}
		}

		for (const key in styleProperties) {
			let prop = styleProperties[key];
			const value = get(style, key, prop[1]);
			if (value !== undefined) {
				style[prop[0]] = value;
			}
		}

		style.width = width + 'px';
		style.height = height + 'px';
		element.title = !isNil(tooltip) ? tooltip : '';

		super(scene, x, y, element, style);
		this.type = 'InputText';

		stopPropagationTouchEvents(this.node);
	}

	addListener(event, handler) {
		if (this.node) {
			this.node.addEventListener(event, handler, false);
		}
		return this;
	}

	removeListener(event, handler) {
		if (this.node) {
			this.node.removeEventListener(event, handler);
		}

		return this;
	}

	resize(width, height) {
		var style = this.node.style;
		style.width = width + 'px';
		style.height = height + 'px';
		this.updateSize();
		return this;
	}

	get value() {
		return this.node.value;
	}

	set value(value) {
		this.node.value = value;
	}

	get width() {
		return this.node && parseFloat(this.node.style.width);
	}

	set width(value) {
		if (this.node) this.node.style.width = value + 'px';
	}

	get height() {
		return this.node && parseFloat(this.node.style.height);
	}

	set height(value) {
		if (this.node) this.node.style.height = value + 'px';
	}

	selectText() {
		this.node.select();
		return this;
	}

	get placeholder() {
		return this.node.placeholder;
	}

	set placeholder(value) {
		this.node.placeholder = value;
	}

	get tooltip() {
		return this.node.title;
	}

	set tooltip(value) {
		this.node.title = !isNil(value) ? value : '';
	}

	setTooltip(value) {
		this.tooltip = value;
		return this;
	}

	setTextChangedCallback(callback) {
		this.onTextChanged = callback;
		return this;
	}

	get readOnly() {
		return this.node.readOnly;
	}

	set readOnly(value) {
		this.node.readOnly = value;
	}

	setReadOnly(value) {
		if (value === undefined) {
			value = true;
		}
		this.readOnly = value;
		return this;
	}

	get spellCheck() {
		return this.node.spellcheck;
	}

	set spellCheck(value) {
		this.node.spellcheck = value;
	}

	set style(styleProps = emptyObject) {
		if (!this.node) return;
		for (const key in styleProps) {
			const prop = styleProperties[key];
			if (!prop) continue;
			this.node.style[prop[0]] = styleProps[key];
		}
		return this.node.style;
	}

	get style() {
		return this.node && this.node.style;
	}

	setSpellCheck(value) {
		this.spellCheck = value;
		return this;
	}

	scrollToBottom() {
		this.node.scrollTop = this.node.scrollHeight;
		return this;
	}

	setEnabled(enabled) {
		if (enabled === undefined) {
			enabled = true;
		}
		this.node.disabled = !enabled;
		return this;
	}

	setBlur() {
		this.node.blur();
		return this;
	}

	setFocus() {
		this.node.focus();
		return this;
	}
}

export default InputText;
