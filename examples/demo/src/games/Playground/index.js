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
	Particles,
	Blitter
} from 'react-phaser-bindings';
import gemsJson from './gems.json';
import flares from './flares.json';
import isoblocksJson from './isoblocks.json';

var config = {
	width: 800,
	height: 600
};

const assets = [
	['atlas', 'coins', 'media/coins.png', 'media/coins.json'],
	['atlas', 'blocks', 'media/isoblocks.png', isoblocksJson],
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

	onShow = () => {
		this.setState(({ param }) => ({
			param: !param
		}));
	};

	render() {
		const { x, y, show, param } = this.state;
		return (
			<Game config={config}>
				<Scene name="scene" assets={assets} active>
					<Blitter
						x={0}
						y={0}
						texture="blocks"
						frame="block-040"
						data={[
							{
								x: 100,
								y: 100,
								frame: 'block-000',
								visible: true,
								reset: false,
								alpha: 1,
								flip: {
									x: true,
									y: false
								}
							},
							{
								x: 200,
								y: 200,
								frame: 'block-001'
							},
							{
								x: 300,
								y: 300,
								frame: 'block-0002'
							},
							{
								x: 400,
								y: 400,
								frame: 'block-003'
							},
							{
								x: 500,
								y: 500,
								frame: 'block-004'
							}
						]}
					/>
					<Image interactive texture="crate" x={40} y={30} onMouseDown={this.onShow} />
					{/* <Particles
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
					/> */}
				</Scene>
			</Game>
		);
	}
}

export default PlaygroundGame;
