import React, { Component } from 'react';
import Phaser from 'phaser';
import VideoPlugin from './objects/Video/plugin';

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
			plugins: {
				global: [
					...plugins,
					{
						key: 'Video',
						plugin: VideoPlugin,
						start: true
					}
				]
			}
		});

		this[context] = game;
		this[setRef](game);
		this[mountNode] = GameRenderer.createContainer(game);
		GameRenderer.updateContainer(this.props.children, this[mountNode], this);
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

	componentDidUpdate(prevProps) {
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

	render() {
		const { accessKey, className, role, style, tabIndex, title } = this.props;
		return (
			<div
				ref={(ref) => (this[tagRef] = ref)}
				className={className}
				accessKey={accessKey}§
				tabIndex={tabIndex}
				style={style}
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
