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
	['atlas', 'coins', 'media/coins.png', 'media/coins.json'],
	['atlas', 'gem', 'media/gems.png', gemsJson],
	['atlas', 'flares', 'media/flares.png', flares],
	['audio', 'background', 'media/music.mp3'],
	['bitmapFont', 'bitfont', 'media/bitfont.png', 'media/bitfont.fnt'],
	['image', 'background', 'media/sky.png'],
	['image', 'crate', 'media/crate.png']
];

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
					<Particles
						texture="coins"
						frame="Gold_21.png"
						animation={{
							repeat: -1,
							speed: 12,
							generateFrameNames: {
								prefix: 'Gold_',
								suffix: '.png',
								start: 21,
								end: 30,
								zeroPad: 2
							},
							generateFrameNamess: {
								prefix: 'ruby_',
								suffix: '',
								start: 0,
								end: 6,
								zeroPad: 4
							}
						}}
						config={{
							radial: true,
							x: 400,
							y: 250,
							blendMode: 'SCENE',
							scale: 0.07,
							gravityY: 3000,
							angle: { min: 0, max: 360 },
							speed: 500,
							quantity: 3,
							lifespan: 1500,
							stepRate: 200,
							frequency: 100
						}}
					/>
				</Scene>
			</Game>
		);
	}
}

export default PlaygroundGame;
