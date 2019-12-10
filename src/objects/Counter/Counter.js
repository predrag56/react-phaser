export const performedProps = {
	play: (inst, { play }, object) => {
		if (play) {
			object.play();
		} else {
			object.stop();
		}
	}
};

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

	preRegister(scene, parent) {
		if (this.registered) return;

		const { from, to, duration, locale, delay, pattern, onStart, onUpdate, onComplete } = this.props;

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

	postRegister() {
		this.instance.text = this.formatNumber(this.props.from);
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
