import { omit } from 'lodash';
import TYPES from '../../types';
import BitmapText, { allowedProps as allowedTextProps, performedProps as performedBMTextProps } from '../BitmapText';
import CounterMixin, { performedProps as performedCounterProps, handleOnUpdate, handleOnComplete } from './Counter';

const allowedProps = [...allowedTextProps, 'play'].filter((key) => key !== 'children');

const performedProps = {
	...omit(performedBMTextProps, 'children'),
	...performedCounterProps
};

class CounterText extends BitmapText {
	handleOnUpdate = (tween, { value }) => {
		const { onUpdate } = this.props;

		this.instance.text = this.formatNumber(value);

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
