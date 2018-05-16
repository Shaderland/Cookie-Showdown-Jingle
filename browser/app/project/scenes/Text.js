
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
				text: 'Cookie',
				font: 'lobster',
				textAlign: 'center',
				fontSize: 270,
				fillStyle: 'white',
				textAlign: 'center',
				textBaseline: 'middle',
				width: 1024,
				height: 1024,
				shadowColor: 'rgba(0,0,0,.5)',
				shadowBlur: 8,
				offsetY: -170,
			},
			{
				text: 'Showdown',
				fontSize: 160,
				offsetY: 0,
			},
			{
				text: 'ponk - koltes',
				fontSize: 160,
				offsetY: 200,
			},
		];
		uniforms.textTexture = { value: makeText.createTexture(words) };
		uniforms.frameNumber = { value: 0. };
	}

	update(time) {
		super.update(time);
	}

	updateText(words) {
		uniforms.textTexture = { value: makeText.createTexture(words) };
		uniforms.frameNumber.value += 1.;
	}
}
