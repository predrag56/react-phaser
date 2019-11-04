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
	Blitter,
	Circle,
	Ellipse,
	Rectangle,
	Triangle,
	Polygon,
	Star
} from 'react-phaser-bindings';
import gemsJson from './gems.json';
import flares from './flares.json';
import isoblocksJson from './isoblocks.json';

var config = {
	width: 800,
	height: 600
};

const assets = [
	['image', 'crate', 'media/crate.png'],
	['atlas', 'gem', 'media/gems.png', gemsJson],
	['atlas', 'coins', 'media/coins.png', 'media/coins.json'],
	['atlas', 'blocks', 'media/isoblocks.png', isoblocksJson]
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
		play: null,
		flag: false
	};

	handlePlayStop = () => {
		this.setState(({ play }) => ({
			play: play ? false : 'spin'
		}));
	};

	toggleFlag = () =>
		this.setState(({ flag }) => ({
			flag: !flag
		}));

	render() {
		const { x, y, play, flag } = this.state;
		console.log('stroke!', flag);
		return (
			<Game config={config}>
				<Scene name="scene" assets={assets} active>
					<Container x={0} y={0} width={100} height={100}>
						<Text interactive x={350} y={250} width={100} onClick={this.toggleFlag}>
							PLAY / STOP
						</Text>
						<Circle
							x={100}
							y={100}
							radius={150}
							fillColor="0xffff00"
							alpha={1}
							strokeWidth={10}
							strokeColor="0xff0000"
							strokeAlpha={0.7}
							stroke={flag}
						/>
						<Ellipse
							x={300}
							y={300}
							width={150}
							height={100}
							angle={30}
							fillColor="0xff5f00"
							strokeWidth={10}
							strokeColor="0xff0000"
							strokeAlpha={0.7}
							stroke
						/>
						<Rectangle
							x={560}
							y={360}
							width={150}
							height={100}
							angle={-30}
							fillColor="0x005fff"
							strokeWidth={3}
							strokeColor="0x00ff00"
							strokeAlpha={1}
							stroke
						/>
						<Polygon
							x={360}
							y={100}
							points={[0, 0, 100, 100, 100, 200, flag ? 400 : 300, 20]}
							angle={0}
							fillColor="0x005fff"
							strokeWidth={3}
							strokeColor="0x00ff00"
							strokeAlpha={1}
							stroke
						/>
						<Star
							x={560}
							y={100}
							points={flag ? 5 : 10}
							angle={0}
							fillColor="0x005fff"
							strokeWidth={3}
							strokeColor="0x00ff00"
							strokeAlpha={1}
							stroke
						/>
						{/*<Tween
							play={play}
							//onComplete={this.handlePlayStop}
							animations={{
								// spin: {
								// 	// repeat: -1,
								// 	// yoyo: true,
								// 	props: [{ y: 0, x: 0, opacity: 1 }, { y: 500, x: 0, opacity: 0.5 }],
								// 	duration: 300
								// }
								spin: {
									complex: true,
									queue: ['spinStart', 'spinLoop', 'spinEnd']
								},
								spinStart: {
									repeat: 0,
									props: [{ y: 250, x: 0 }, { y: 700, x: 0 }],
									ease: 'Sine.In',
									duration: 1000
								},
								spinLoop: {
									repeat: -1,
									props: [{ y: -100, x: 0 }, { y: 700, x: 0 }],
									ease: 'Linear',
									duration: 500
								},
								spinEnd: {
									repeat: 0,
									props: [{ y: -100, x: 0 }, { y: 250, x: 0 }],
									ease: 'Sine.Out',
									duration: 1000
								}
							}}
						>
							<Container x={0} y={250} width={100} height={300}>
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
						</Tween>*/}
					</Container>
					{/*<Blitter
						x={0}
						y={0}
						texture="blocks"
						frame="block-040"
						data={[
							{
								x: 100,
								y: 100,
								frame: 'block-000'
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
					/>*/}
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
