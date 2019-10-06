import React, { Component, Fragment } from 'react';
import { Provider, connect, ReactReduxContext } from 'react-redux';
import { createStore } from 'redux';
import { Game, Scene, Sprite, Image, Text, BitmapText, Audio, Zone } from 'react-phaser-bindings';
import gemsJson from './gems.json';

const store = createStore(() => ({ lol: true }));

var config = {
	width: 800,
	height: 600
};

const assets = [
	['atlas', 'gem', 'media/gems.png', gemsJson],
	['audio', 'background', 'media/music.mp3'],
	['bitmapFont', 'bitfont', 'media/bitfont.png', 'media/bitfont.fnt'],
	['image', 'background', 'media/sky.png'],
	['image', 'crate', 'media/crate.png']
];

class App extends Component {
	state = {
		x: 60,
		y: 10
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
						<ReactReduxContext.Consumer>
							{function() {
								console.log('consumer', arguments);
								return null;
							}}
						</ReactReduxContext.Consumer>
						<Demo />
						<Image interactive texture="background" x={0} y={0} onClick={() => this.setState({ show: !show })} />
						{show && (
							<Fragment>
								<Zone
									x={0}
									y={0}
									width={100}
									height={100}
									interactive
									onMouseDown={() => console.log('Privet Zone!')}
								/>
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
							</Fragment>
						)}
					</Scene>
				</Provider>
			</Game>
		);
	}
}

const Demo = connect((state) => console.log(state) || { gameInfo: state.lol })(() => []);

export default App;
