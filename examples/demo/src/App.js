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

const store = createStore(() => ({ lol: true }));

var config = {
	width: 800,
	height: 600
};

const assets = [
	['atlas', 'gem', 'media/gems.png', gemsJson],
	['atlas', 'flares', 'media/flares.png', flares],
	['audio', 'background', 'media/music.mp3'],
	['bitmapFont', 'bitfont', 'media/bitfont.png', 'media/bitfont.fnt'],
	['image', 'background', 'media/sky.png'],
	['image', 'crate', 'media/crate.png']
];

class App extends Component {
	state = {
		x: 60,
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
				<Provider store={store}>
					<Scene name="demo" assets={assets} active>
						<Container>
							<Image
								texture="crate"
								tweens={[
									{
										key: 'start',
										repeat: 1,
										ease: 'ease-in',
										yoyo: true,
										duration: 300,
										y: 100
									},
									{
										key: 'repeat',
										repeat: -1,
										duration: 3000,
										y: 1000
									},
									{
										key: 'finish',
										repeat: 1,
										yoyo: true,
										ease: 'ease-out',
										duration: 3000,
										y: 1000
									}
								]}
								tweenPlay="start"
							/>
						</Container>
						{/*<Tween
							play="start"
							animations={[
								{
									key: 'start',
									repeat: 1,
									ease: 'ease-in',
									yoyo: true,
									duration: 300,
									y: 100
								},
								{
									key: 'repeat',
									repeat: -1,
									duration: 3000,
									y: 1000
								},
								{
									key: 'finish',
									repeat: 1,
									yoyo: true,
									ease: 'ease-out',
									duration: 3000,
									y: 1000
								}
							]}
							onLoop={() => {}}
							onComplete={() => {}}
							onRepeat={() => {}}
						></Tween>*/}
						<Sprite
							interactive
							transition="x 150 Quad.easeInOut, y 150 Quad.easeInOut"
							texture="gem"
							play="ruby"
							x={x}
							y={y}
							animations={[
								{
									key: 'ruby',
									repeat: -1,
									generateFrameNames: {
										prefix: 'ruby_',
										suffix: '',
										start: 0,
										end: 6,
										zeroPad: 4
									}
								}
							]}
							onClick={this.handleGem}
							ignoreIfPlaying={false}
							startFrame={0}
						/>
					</Scene>
				</Provider>
			</Game>
		);
	}
}

export default App;
