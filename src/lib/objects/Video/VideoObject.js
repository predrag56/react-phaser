import Phaser from 'phaser';
import { get } from 'lodash';
import emptyObject from 'fbjs/lib/emptyObject';

const { CanvasPool } = Phaser.Display.Canvas;
const { Components, GameObject } = Phaser.GameObjects.Components;
const { getTintAppendFloatAlpha } = Phaser.Renderer.WebGL.Utils;

const videoTypes = ['webm', 'ogg', 'mp4', 'h264', 'vp9', 'hls'];
const elementEvents = ['canplay', 'canplaythrough', 'loadstart', 'playing', 'stalled', 'ended', 'error', 'pause'];
const elementProperties = {
	id: undefined,
	width: undefined,
	height: undefined,
	autoplay: true,
	controls: false,
	loop: false,
	poster: undefined,
	preload: undefined,
	muted: false,
	playsInline: true,
	crossOrigin: 'anonymous'
};

/* eslint-disable */
class VideoGameObject extends GameObject {
	constructor(scene, config) {
		const { src, x = 0, y = 0, width = 1, height = 1 } = config;

		super(scene, 'Video');

		this.renderer = scene.sys.game.renderer;

		this.resolution = scene.sys.game.config.resolution;
		this.canvas = CanvasPool.create(this, this.resolution * width, this.resolution * height);
		this.context = this.canvas.getContext('2d');
		this.dirty = false;

		this.setPosition(x, y);
		this.setSize(width, height);
		this.setOrigin(0.5, 0.5);
		this.initPipeline();

		this._crop = this.resetCropObject();

		this.texture = scene.sys.textures.addCanvas(null, this.canvas, true);

		this.frame = this.texture.get();

		this.frame.source.resolution = this.resolution;

		if (this.renderer && this.renderer.gl) {
			this.renderer.deleteTexture(this.frame.source.glTexture);
			this.frame.source.glTexture = null;
		}

		this.dirty = true;

		scene.sys.game.events.on(
			'contextrestored',
			function() {
				this.dirty = true;
			},
			this
		);

		this.type = 'Video';

		this.createVideoElement(config);
		this.load(src);
	}

	getCanvas(readOnly) {
		if (!readOnly) {
			this.dirty = true;
		}
		return this.canvas;
	}

	renderWebGL(renderer, src, interpolationPercentage, camera, parentMatrix) {
		if (this.readyState > 0) {
			this.renderer.canvasToTexture(this.video, this.frame.source.glTexture, true);
			this.frame.glTexture = this.frame.source.glTexture;
		} else {
			var renderer = this.renderer;
			var gl = renderer.gl;
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			renderer.setFramebuffer(null, true);
		}

		if (src.dirty) {
			src.updateTexture();
			src.dirty = false;
		}

		if (src.width === 0 || src.height === 0) {
			return;
		}

		const { frame } = src;
		const { width, height } = frame;

		this.pipeline.batchTexture(
			src,
			frame.glTexture,
			width,
			height,
			src.x,
			src.y,
			width / src.resolution,
			height / src.resolution,
			src.scaleX,
			src.scaleY,
			src.rotation,
			src.flipX,
			src.flipY,
			src.scrollFactorX,
			src.scrollFactorY,
			src.displayOriginX,
			src.displayOriginY,
			0,
			0,
			width,
			height,
			getTintAppendFloatAlpha(src._tintTL, camera.alpha * src._alphaTL),
			getTintAppendFloatAlpha(src._tintTR, camera.alpha * src._alphaTR),
			getTintAppendFloatAlpha(src._tintBL, camera.alpha * src._alphaBL),
			getTintAppendFloatAlpha(src._tintBR, camera.alpha * src._alphaBR),
			src._isTinted && src.tintFill,
			0,
			0,
			camera,
			parentMatrix
		);
	}

	renderCanvas(renderer, src, interpolationPercentage, camera, parentMatrix) {
		if (this.readyState > 0) {
			this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
		} else {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		if (src.width || src.height) {
			renderer.batchSprite(src, src.frame, camera, parentMatrix);
		}
	}

	needRedraw() {
		this.dirty = true;
		return this;
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.dirty = true;
		return this;
	}

	fill(color) {
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.dirty = true;
		return this;
	}

	getPixel(x, y, out) {
		if (out === undefined) {
			out = new Color();
		}
		var rgb = this.context.getImageData(x, y, 1, 1);
		out.setTo(rgb.data[0], rgb.data[1], rgb.data[2], rgb.data[3]);
		return out;
	}

	setPixel(x, y, r, g, b, a) {
		if (typeof r !== 'number') {
			var color = r;
			r = color.red;
			g = color.green;
			b = color.blue;
			a = color.alpha;
		}

		if (a === undefined) {
			a = r !== 0 || g !== 0 || b !== 0 ? 255 : 0;
		}

		var imgData = this.context.createImageData(1, 1);
		imgData.data[0] = r;
		imgData.data[1] = g;
		imgData.data[2] = b;
		imgData.data[3] = a;
		this.context.putImageData(imgData, x, y);
		this.dirty = true;
		return this;
	}

	updateTexture(callback, scope) {
		if (callback) {
			if (scope) {
				callback.call(scope, this.canvas, this.context);
			} else {
				callback(this.canvas, this.context);
			}
		}

		if (this.canvas.width !== this.frame.width || this.canvas.height !== this.frame.height) {
			this.frame.setSize(this.canvas.width, this.canvas.height);
		}
		if (this.renderer.gl) {
			this.frame.source.glTexture = this.renderer.canvasToTexture(this.canvas, this.frame.source.glTexture, true);
			this.frame.glTexture = this.frame.source.glTexture;
		}
		this.dirty = false;

		var input = this.input;
		if (input && !input.customHitArea) {
			input.hitArea.width = this.width;
			input.hitArea.height = this.height;
		}
		return this;
	}

	generateTexture(key, x, y, width, height) {
		var srcCanvas = this.canvas;
		var sys = this.scene.sys;
		var renderer = sys.game.renderer;
		var texture;

		if (x === undefined) {
			x = 0;
		}

		if (y === undefined) {
			y = 0;
		}

		if (width === undefined) {
			width = srcCanvas.width;
		} else {
			width *= this.resolution;
		}

		if (height === undefined) {
			height = srcCanvas.height;
		} else {
			height *= this.resolution;
		}

		if (sys.textures.exists(key)) {
			texture = sys.textures.get(key);
		} else {
			texture = sys.textures.createCanvas(key, width, height);
		}

		var destCanvas = texture.getSourceImage();
		if (destCanvas.width !== width) {
			destCanvas.width = width;
		}
		if (destCanvas.height !== height) {
			destCanvas.height = height;
		}

		var destCtx = destCanvas.getContext('2d');
		destCtx.clearRect(0, 0, width, height);
		destCtx.drawImage(srcCanvas, x, y, width, height);
		if (renderer.gl && texture) {
			renderer.canvasToTexture(destCanvas, texture.source[0].glTexture, true, 0);
		}

		return this;
	}

	loadTexture(key, frame) {
		var textureFrame = this.scene.textures.getFrame(key, frame);
		if (!textureFrame) {
			return this;
		}

		if (this.width !== textureFrame.cutWidth || this.height !== textureFrame.cutHeight) {
			this.resize(textureFrame.cutWidth, textureFrame.cutHeight);
		} else {
			this.context.clearRect(0, 0, textureFrame.cutWidth, textureFrame.cutHeight);
		}
		this.context.drawImage(
			textureFrame.source.image,
			textureFrame.cutX,
			textureFrame.cutY,
			textureFrame.cutWidth,
			textureFrame.cutHeight,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);
		this.dirty = true;
		return this;
	}

	resize(width, height) {
		if (this.width === width && this.height === height) {
			return this;
		}

		this.video.width = width;
		this.video.height = height;

		this.setSize(width, height).updateDisplayOrigin();

		width *= this.resolution;
		height *= this.resolution;
		width = Math.max(Math.ceil(width), 1);
		height = Math.max(Math.ceil(height), 1);
		this.canvas.width = width;
		this.canvas.height = height;
		this.dirty = true;

		return this;
	}

	createVideoElement(config = emptyObject) {
		if (this.video) {
			return this.video;
		}

		const element = document.createElement('video');

		for (let key in elementProperties) {
			let value = get(config, key, elementProperties[key]);
			if (value !== undefined) {
				element[key] = value;
			}
		}

		for (let key of elementEvents) {
			element.addEventListener(key, () => this.emit(key, this));
		}

		const { playbackTimeChangeEventEnable = true } = config;

		this.video = element;
		this.playbackTimeChangeEventEnable = playbackTimeChangeEventEnable;

		return this.video;
	}

	preDestroy() {
		//  This Game Object has already been destroyed
		if (!this.scene) {
			return;
		}
		if (this.video) {
			this.video.pause();
			this.video.removeAttribute('src'); // empty source
			this.video.load();
			this.video = undefined;
		}

		CanvasPool.remove(this.canvas);
	}

	preUpdate(time, delta) {
		if (this.playbackTimeChangeEventEnable) {
			var curT = this.playbackTime;
			if (curT !== this.prevT) {
				this.emit('playbacktimechange', this);
			}
			this.prevT = curT;
		}
		if (super.preUpdate) {
			super.preUpdate(time, delta);
		}
	}

	get availableVideoTypes() {
		return this.scene.sys.game.device.video;
	}

	load(src) {
		if (!this.video) {
			return this;
		}

		const supportedVideoTypes = this.scene.sys.game.device.video;

		if (typeof src === 'object') {
			for (let ext of videoTypes) {
				if (supportedVideoTypes[`${ext}Video`] && src[ext]) {
					src = src[ext];
				}
			}
		}

		this.video.src = src;
		this.video.load();

		return this;
	}

	play() {
		if (this.video) {
			this.video.play();
		}
		return this;
	}

	get isPlaying() {
		if (this.video) {
			var video = this.video;
			return !video.paused && !video.ended && video.currentTime > 0;
		} else {
			return false;
		}
	}

	pause() {
		if (this.video) {
			this.video.pause();
		}
		return this;
	}

	get isPaused() {
		if (this.video) {
			return this.video.paused;
		} else {
			return false;
		}
	}

	get playbackTime() {
		if (this.video) {
			return this.video.currentTime || 0;
		} else {
			return 0;
		}
	}

	set playbackTime(value) {
		if (this.video) {
			try {
				this.video.currentTime = value;
			} catch (e) {}
		}
	}

	setPlaybackTime(time) {
		this.playbackTime = time;
		return this;
	}

	get duration() {
		if (this.video) {
			return this.video.duration || 0;
		} else {
			return 0;
		}
	}

	get t() {
		if (this.video) {
			var duration = this.duration;
			return duration === 0 ? 0 : this.playbackTime / duration;
		} else {
			return 0;
		}
	}

	set t(value) {
		if (this.video) {
			this.playbackTime = this.duration * Clamp(value, 0, 1);
		}
	}

	setT(value) {
		this.t = value;
		return this;
	}

	get hasEnded() {
		if (this.video) {
			return this.video.ended;
		} else {
			return false;
		}
	}

	get volume() {
		if (this.video) {
			return this.video.volume || 0;
		} else {
			return 0;
		}
	}

	set volume(value) {
		if (this.video) {
			this.video.volume = value;
		}
	}

	setVolume(value) {
		this.volume = value;
		return this;
	}

	get muted() {
		if (this.video) {
			return this.video.muted || false;
		} else {
			return false;
		}
	}

	set muted(value) {
		if (this.video) {
			this.video.muted = value;
		}
	}

	setMute(value) {
		if (value === undefined) {
			value = true;
		}
		this.muted = value;
		return this;
	}

	get loop() {
		if (this.video) {
			return this.video.loop;
		} else {
			return false;
		}
	}

	set loop(value) {
		if (this.video) {
			this.video.loop = value;
		}
	}

	setLoop(value) {
		if (value === undefined) {
			value = true;
		}
		this.loop = value;
		return this;
	}

	get readyState() {
		if (this.video) {
			return this.video.readyState;
		} else {
			return undefined;
		}
	}
}

Phaser.Class.mixin(VideoGameObject, [
	Components.Alpha,
	Components.BlendMode,
	Components.ComputedSize,
	Components.Crop,
	Components.Depth,
	Components.Flip,
	Components.GetBounds,
	Components.Mask,
	Components.Origin,
	Components.Pipeline,
	Components.ScrollFactor,
	Components.Tint,
	Components.Transform,
	Components.Visible
]);
/* eslint-enable */

export default VideoGameObject;
