import React, { Component } from 'react';
import { Game, Scene, Sprite, Image, Text, BitmapText, Audio, Zone } from '../';
import gemsJson from './gems.json';

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
		x: 60
	};

	handleGem = () => {
		console.log('clicked!');
		this.setState(({ x }) => ({
			x: x === 60 ? 180 : 60
		}));
	};

	render() {
		const { x } = this.state;
		return (
			<Game config={config}>
				<Scene name="demo" assets={assets} active>
					<Audio name="background" play={false} loop />
					<Image texture="background" x={0} y={0} />
					<Sprite
						interactive
						transition="x 400 Sine.easeInOut, y 400 Sine.easeInOut, x 300 Sine.easeInOut"
						texture="gem"
						play="ruby"
						x={x}
						y={50}
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
					<BitmapText x="310" y="70" font="bitfont" size={22} align="left">
						DEMO SCENE
					</BitmapText>
					<Text
						scale={1}
						angle={0}
						x={315}
						y={127}
						style={{
							fill: '#000',
							fontSize: '20px'
						}}
					>
						React Phaser
					</Text>
					<Image texture="crate" x={100} y={180} />
					<Image
						interactive
						texture="crate"
						x={440}
						y={300}
						onMouseDown={(...args) => {
							console.log('Privet!', args);
						}}
					/>
					<Sprite
						texture="gem"
						play="diamond"
						x={20}
						y={250}
						animations={[
							{
								key: 'diamond',
								repeat: -1,
								generateFrameNames: {
									prefix: 'diamond_',
									suffix: '',
									start: 0,
									end: 15,
									zeroPad: 4
								}
							}
						]}
						ignoreIfPlaying={false}
						startFrame={0}
					/>
					<Sprite
						texture="gem"
						play="prism"
						x={600}
						y={150}
						animations={[
							{
								key: 'prism',
								repeat: -1,
								generateFrameNames: {
									prefix: 'prism_',
									suffix: '',
									start: 0,
									end: 6,
									zeroPad: 4
								}
							}
						]}
						ignoreIfPlaying={false}
						startFrame={0}
					/>
					<Sprite
						texture="gem"
						play="square"
						x={200}
						y={350}
						animations={[
							{
								key: 'square',
								repeat: -1,
								generateFrameNames: {
									prefix: 'square_',
									suffix: '',
									start: 0,
									end: 14,
									zeroPad: 4
								}
							}
						]}
						ignoreIfPlaying={false}
						startFrame={0}
					/>
					<Zone x={0} y={0} width={100} height={100} interactive onMouseDown={() => console.log('Privet Zone!')} />
				</Scene>
			</Game>
		);
	}
}

export default App;
