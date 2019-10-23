import React, { Component, Fragment } from 'react';
import { Provider, connect, ReactReduxContext } from 'react-redux';
import { createStore } from 'redux';
import {
	Game,
	Scene,
	Sprite,
	Image,
	Text,
	BitmapText,
	Audio,
	Zone,
	Tween,
	Container,
	Particles
} from 'react-phaser-bindings';
import gemsJson from './gems.json';
import flares from './flares.json';

var config = {
	width: 800,
	height: 600
};

const assets = [
	['atlas', 'gem', 'media/gems.png', gemsJson],
	['atlas', 'flares', 'media/flares.png', flares],
	['image', 'crate', 'media/crate.png']
];

window.tweensConfig = [
	{
		repeat: 0,
		duration: 1000,
		ease: 'Sine.easeIn',
		props: {
			x: {
				from: 0,
				value: 1000
			}
		}
	},
	{
		loop: 3,
		duration: 1000,
		ease: 'Linear',
		props: {
			x: {
				from: -1000,
				value: 1000
			}
		},

		onRepeat: (...args) => console.log('onRepeat', args),
		onLoop: (...args) => console.log('onLoop', args)
	},
	{
		repeat: 0,
		duration: 1000,
		ease: 'Sine.easeOut',
		props: {
			x: {
				from: -1000,
				value: 0
			}
		}
	}
];

window.stopTween = false;
window.tw = null;
window.order = 0;
window.start = (force) => {
	if (force) stopTween = false;
	if (stopTween) return;

	const config = {
		...tweensConfig[order]
	};

	order++;

	config.props = Object.entries(config.props).reduce((acc, [key, prop]) => {
		console.log(key, prop, { ...container.props, [key]: prop.from });

		const from = prop.from;
		prop = { ...prop };

		delete prop.from;

		if (typeof from !== undefined) {
			container.instance[key] = from;
		}

		acc[key] = prop;

		return acc;
	}, {});

	console.log(order, container.instance.x);
	if (order >= tweensConfig.length) {
		order = 0;
	}

	tw = sc.add.tween({
		targets: container.instance,
		...config,
		onComplete: () => start()
	});
};

window.stop = () => {
	stopTween = true;
};

class PlaygroundGame extends Component {
	state = {
		x: 300,
		y: 10,
		param: false
	};

	handleGem = () => {
		console.log('clicked!');
		this.setState(({ x, y }) => ({
			x: x === 60 ? 400 : 60,
			y: y === 10 ? 400 : 10
		}));
	};

	render() {
		const { x, y, show } = this.state;
		return (
			<Game config={config}>
				<Scene name="scene" assets={assets} active>
					<Container x={10} y={0}>
						<Image texture="gem" frame="prism_0002" x={0} y={30} />
						<Image texture="gem" frame="square_0002" x={70} y={30} />
						<Image texture="gem" frame="ruby_0000" x={2 * 70} y={30} />
						<Image texture="gem" frame="diamond_0000" x={3 * 70} y={30} />
						<Image texture="gem" frame="prism_0002" x={4 * 70} y={30} />
						<Image texture="gem" frame="square_0002" x={5 * 70} y={30} />
						<Image texture="gem" frame="ruby_0000" x={6 * 70} y={30} />
						<Image texture="gem" frame="diamond_0000" x={7 * 70} y={30} />
						<Image texture="gem" frame="prism_0002" x={8 * 70} y={30} />
						<Image texture="gem" frame="square_0002" x={9 * 70} y={30} />
						<Image texture="gem" frame="ruby_0000" x={10 * 70} y={30} />
					</Container>
				</Scene>
			</Game>
		);
	}
}

export default PlaygroundGame;
