import { omit } from 'lodash';
import TYPES from '../../types';
import Text, { allowedProps as allowedTextProps, performedProps as performedTextProps } from '../Text';
import CounterMixin, { performedProps as performedCounterProps, allowedProps as allowedCounterProps } from './Counter';

const allowedProps = [...allowedTextProps, ...allowedCounterProps].filter((key) => key !== 'children');

const performedProps = {
	...omit(performedTextProps, 'children'),
	...performedCounterProps
};

class CounterText extends Text {
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
	type: TYPES.COUNTERTEXT,
	performedProps,
	allowedProps
});

export default CounterText;
