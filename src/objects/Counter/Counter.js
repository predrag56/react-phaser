const updateTween = (inst, value, object) => {
	object.resetTween();
};

export const performedProps = {
	play: (inst, { play }, object) => {
		if (play) {
			object.play();
		} else {
			object.stop();
		}
	},
	from: updateTween,
	to: updateTween,
	duration: updateTween,
	delay: updateTween
};

export const allowedProps = ['play', 'from', 'to', 'duration', 'delay'];

const CounterMixin = {
	defaultProps: {
		locale: undefined,
		pattern: undefined,
		leadingZero: undefined,
		format: undefined,
		fractionDigits: 0
	},

	formatNumber(number) {
		const { pattern, locale, fractionDigits, leadingZero, format } = this.props;

		let text;

		if (format) {
			return format(number);
		}

		if (locale) {
			text = number.toLocaleString(locale, {
				minimumFractionDigits: fractionDigits,
				maximumFractionDigits: fractionDigits
			});
		} else {
			text = number.toFixed(fractionDigits);
		}

		if (leadingZero) {
			text = text.padStart(leadingZero, 0);
		}

		if (pattern) {
			text = pattern.replace(/\$1/g, text);
		}

		return text;
	},

	resetTween() {
		const { from, to, duration, delay, onStart } = this.props;

		if (this.counter) {
			this.counter.remove();
		}

		this.counter = this.scene.tweens.addCounter({
			delay,
			from,
			to,
			duration,
			paused: true,
			onStart,
			onUpdate: this.handleOnUpdate,
			onComplete: this.handleOnComplete
		});
	},

	preRegister() {
		if (this.registered) return;

		this.resetTween();
	},

	postRegister() {
		this.instance.text = this.formatNumber(this.props.from);

		window.tc = this;
	},

	play() {
		if (!this.counter.isPlaying()) {
			this.counter.play();
		}
	},

	stop() {
		if (this.counter.isPlaying()) {
			this.counter.stop();
		}
	}
};

export default CounterMixin;
