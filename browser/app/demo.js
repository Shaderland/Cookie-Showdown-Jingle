
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import uniforms from './engine/uniforms';
import parameters from './project/parameters';
import Keyboard from './engine/keyboard';
import Render from './project/render';
import Fire from './project/scenes/Fire';
import Text from './project/scenes/Text';
import Raymarch from './project/scenes/Raymarch';
import Background from './project/scenes/Background';

export default function() {
	let scenes, uniformMaps, render, text;

	assets.load(function() {

		Keyboard.setup();

		uniforms.time.value = 0;
		uniformMaps = [];
		Object.keys(parameters).forEach(keyRoot => {
			Object.keys(parameters[keyRoot]).forEach(keyChild => {
				uniforms[keyRoot+keyChild] = { value: parameters[keyRoot][keyChild] };
				uniformMaps.push({ root:keyRoot, child:keyChild });
			});
		});

		var text = new Text();

	  scenes = [
	  	// new Fire(),
	  	text,
	  	new Background(),
	  	// new Raymarch(),
	  ];

		render = new Render();

		timeline.start();

		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		text.updateText([
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
				text: 'flopine - lsdlive',
				fontSize: 160,
				offsetY: 200,
			},
		]);
	});

	function animate() {
		requestAnimationFrame(animate);
		const time = timeline.getTime();

		uniforms.time.value = time;
		uniformMaps.forEach(parameter => {
			var name = parameter.root+parameter.child;
			// uniforms[name].value = assets.animations.getValue(name, time);
			uniforms[name].value = parameters[parameter.root][parameter.child];
		})

		camera.update(time);
		scenes.forEach(scene => {
			if (scene.update !== undefined) {
				scene.update(time);
			}
		})
		render.update(time);
		renderer.render(render, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		uniforms.resolution.value = [window.innerWidth, window.innerHeight];
	}
}
