import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';

export const gui = new dat.gui.GUI();

gui.remember(parameters);

Object.keys(parameters).forEach(keyRoot => {
	var folder = gui.addFolder(keyRoot);

	Object.keys(parameters[keyRoot]).forEach(key => {
		const item = folder.add(parameters[keyRoot], key);
		const name = key.toLowerCase();
		item.step(0.01);
	});
	folder.open();
});
// gui.close();
