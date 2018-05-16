
import { Mesh, PlaneGeometry } from 'three.js';
import assets from '../../engine/assets';
import uniforms from '../../engine/uniforms';
import Scene from '../../engine/scene';

export default class Raymarch extends Scene {

	constructor() {
		super('backgroundTexture');
    this.add(new Mesh(new PlaneGeometry(1,1,1), assets.shaders.background));
  }

}
