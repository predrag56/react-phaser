import Phaser from 'phaser';
import InputText from './InputObject.js';
const { BuildGameObject } = Phaser.GameObjects;

function InputTextCreator(config, addToScene) {
	config.add = addToScene || config.add;
	const gameObject = new InputText(this.scene, config);
	BuildGameObject(this.scene, gameObject, config);
	return gameObject;
}

function InputTextFactory(config) {
	const gameObject = new InputText(this.scene, config);
	this.scene.add.existing(gameObject);
	return gameObject;
}

class InputTextPlugin extends Phaser.Plugins.BasePlugin {
	constructor(pluginManager) {
		super(pluginManager);
		pluginManager.registerGameObject('InputText', InputTextFactory, InputTextCreator);
		Phaser.GameObjects.InputText = InputText;
	}

	start() {
		this.game.events.once('destroy', this.destroy, this);
	}
}

export default InputTextPlugin;
