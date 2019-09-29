import Phaser from 'phaser';
import Video from './VideoObject.js';
const { BuildGameObject } = Phaser.GameObjects;

function VideoCanvasCreator(config, addToScene) {
	const { width, height } = config;
	config.add = addToScene || config.add;
	const gameObject = new Video(this.scene, 0, 0, width, height, config);
	BuildGameObject(this.scene, gameObject, config);
	return gameObject;
}

function VideoCanvasFactory(config) {
	const gameObject = new Video(this.scene, config);
	this.scene.add.existing(gameObject);
	return gameObject;
}

class VideoPlugin extends Phaser.Plugins.BasePlugin {
	constructor(pluginManager) {
		super(pluginManager);
		pluginManager.registerGameObject('Video', VideoCanvasFactory, VideoCanvasCreator);
		Phaser.GameObjects.Video = Video;
	}

	start() {
		var eventEmitter = this.game.events;
		eventEmitter.once('destroy', this.destroy, this);
	}
}

export default VideoPlugin;
