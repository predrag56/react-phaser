# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://gitlab.com/firanolfind/react-phaser-bindings/compare/develop...master) (2020-04-20)

_put moar here_

## [v1.4.0](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.3.4...v1.4.0) (2020-04-28)

### Changed

- Assets become optional for Scene

## [v1.3.4](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.3.3...v1.3.4) (2020-04-20)

### Changed

- Muted prop for video now works via performedProps

## [v1.3.3](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.3.2...v1.3.3) (2020-01-02)

### Added

- Added #.preDestroy and #.postDestroy hooks
- Fixed memory leak bugs in Sprites and Particals Game Objects – remove created animations on destroy

## [v1.3.2](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.3.1...v1.3.2) (2019-12-30)

### Changed

- Refactored Scene
- Fixed bug with Text/BitmapText
- Updated examples

## [v1.3.1](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.3.0...v1.3.1) (2019-12-11)

### Changed

- fixed Counter`s update handling and possible memory leak

## [v1.3.0](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.2.1...v1.3.0) (2019-12-10)

### Added

- **CounterText** component
- **CounterBitmapText** component

### Changed

- [internal] added #preRegister method to add game objects
- [internal] removed window debug variables

## [v1.2.1](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.2.0...v1.2.1) (2019-12-03)

### Changed

- Fixed Shape with origin property Bug

## [v1.2.0](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.1.0...v1.2.0) (2019-11-05)

### Added

- Added complex animations support to **Tween**
- Added **Circle**
- Added **Ellipse**
- Added **Triangle**
- Added **Rectangle**
- Added **Polygon**
- Added **Star**
- [internal] **GameObject/Transparent** - object that doesn't add child components to itself but to parent component
- **Mask** component, supports Phaser Geometry Mask for now; extends from Transparent object

### Changed

- upgraded to **Phaser 3.20**
- [internal] **Video** component now based on Phaser 3.20 Video game object
- [internal] **Tween** now extends from Transparent game object
- [internal] game wraps now with dom container

## [v1.1.0](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.0.7...v1.1.0) (2019-10-28)

### Added

- **TextInput** gameobject/plugin
- **Input**
- **Blitter**
- **Tween**
- **Particles**

### Changed

- [internal] register method of gameobjects now gets in second argument parent
- [internal] game wraps now with dom container
