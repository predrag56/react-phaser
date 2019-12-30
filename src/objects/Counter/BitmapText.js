import { omit } from 'lodash';
import TYPES from '../../types';
import BitmapText, { allowedProps as allowedTextProps, performedProps as performedBMTextProps } from '../BitmapText';
import CounterMixin, { performedProps as performedCounterProps, allowedProps as allowedCounterProps } from './Counter';

const allowedProps = [...allowedTextProps, ...allowedCounterProps].filter((key) => key !== 'children');

const performedProps = {
	...omit(performedBMTextProps, 'children'),
	...performedCounterProps
};

class CounterText extends BitmapText {
	handleOnUpdate = (tween, { value }) => {
		if (!this.instance) return;

		const { onUpdate } = this.props;

		const text = this.formatNumber(value);
		this.instance.text = text;

		if (onUpdate) onUpdate(value, text);
	};

	handleOnComplete = (...args) => {
		const { onComplete } = this.props;

		if (onComplete) onComplete(args);
	};
}

Object.assign(CounterText.prototype, CounterMixin, {
	type: TYPES.COUNTERBITMAPTEXT,
	performedProps,
	allowedProps
});

export default CounterText;
