import React, { Component } from 'react';
import { Game, Scene, Sprite, Image, Text, BitmapText, Tween, Container, Audio, Video } from '../';
import gemsJson from './gems.json';

var config = {
	width: 720,
	height: 480
};

const assets = [
	['spritesheet', 'bunnys', 'static/media/bunnys.png', { frameWidth: 30, frameHeight: 43.5 }],
	['atlas', 'gems', 'static/media/gems.png', gemsJson],
	['audio', 'background', 'static/media/background.mp3'],
	['audio', 'gamble', 'static/media/gamble.mp3'],
	['bitmapFont', 'bitfont', 'static/media/bitfont.png', 'static/media/bitfont.fnt'],
	['image', 'bg', 'static/media/images/bg.jpg']
];

class App extends Component {
	render() {
		return (
			<Game config={config}>
				<Scene name="demo"></Scene>
			</Game>
		);
	}
}

export default App;
