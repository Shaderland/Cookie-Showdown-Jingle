
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import Scene from '../../engine/scene';
import uniforms from '../../engine/uniforms';

export default class Text extends Scene {

	constructor() {
		super('textSceneTexture');

		this.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaders.text));
		var words = [
			{
				text: 'Shader\nShowdown',
				font: 'lobster',
				textAlign: 'center',
				fontSize: 196,
				fillStyle: 'white',
				textAlign: 'center',
				textBaseline: 'middle',
				width: 1024,
				height: 1024,
				shadowColor: 'rgba(0,0,0,.5)',
				shadowBlur: 8,
				offsetY: 0,
			},
			// {
			// 	text: 'Paris',
			// 	fontSize: 56,
			// 	offsetY: 100,
			// },
		];
		uniforms.textTexture = { value: makeText.createTexture(words) };
	}

	update(time) {
		super.update(time);
	}
}
