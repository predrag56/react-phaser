import React, { Component } from 'react';
import Phaser from 'phaser';
import GameRenderer from './Renderer';
import TextInputPlugin from './objects/Input/plugin';

const context = Symbol('Game.context');
const tagRef = Symbol('Game.tagRef');
const setRef = Symbol('Game.setRef');
const mountNode = Symbol('Game.mountNode');

class GameContext extends Component {
	componentDidMount() {
		if (!window) {
			return;
		}

		const { config = {}, plugins = [] } = this.props;

		const game = new Phaser.Game({
			type: Phaser.AUTO,
			...config,
			autoStart: false,
			parent: this[tagRef],
			dom: {
				createContainer: true
			},
			plugins: {
				global: [
					...plugins,
					{
						key: 'TextInput',
						plugin: TextInputPlugin,
						start: true
					}
				]
			}
		});
		window.game = game;

		this[context] = game;
		this[setRef](game);
		this[mountNode] = GameRenderer.createContainer(game);
		GameRenderer.updateContainer(this.props.children, this[mountNode], this);
	}

	componentDidUpdate() {
		if (!window) {
			return;
		}

		this[setRef](this[context]);
		GameRenderer.updateContainer(this.props.children, this[mountNode], this);
	}

	componentWillUnmount() {
		if (!window) {
			return;
		}
		this[setRef](null);
		GameRenderer.updateContainer(null, this[mountNode], this);
		this[context].destroy();
	}

	[setRef](value) {
		const { forwardedRef } = this.props;
		if (!forwardedRef) {
			return;
		}
		if (typeof forwardedRef === 'function') {
			forwardedRef(value);
		} else {
			forwardedRef.current = value;
		}
	}

	render() {
		const { className, role, style, tabIndex, title } = this.props;
		return (
			<div
				ref={(ref) => {
					this[tagRef] = ref;
				}}
				className={className}
				tabIndex={tabIndex}
				style={{
					display: 'inline-block',
					...style
				}}
				title={title}
				role={role}
			/>
		);
	}
}

const Game = React.forwardRef((props, ref) => {
	return <GameContext {...props} forwardedRef={ref} />;
});

export default Game;
