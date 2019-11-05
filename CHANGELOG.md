# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://gitlab.com/firanolfind/react-phaser-bindings/compare/master...develop) (2019-11-05)

_put moar here_

## [v1.2.0](https://gitlab.com/firanolfind/react-phaser-bindings/compare/v1.1.1...v1.2.0) (2019-11-05)

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
