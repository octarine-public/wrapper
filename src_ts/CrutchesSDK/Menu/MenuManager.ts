import { default as Color } from "../Base/Color";

import * as MenuControllers from "./Tree"

export { MenuControllers }

class MenuManager extends MenuControllers.Tree {

	/**
	 *
	 * @param name Name of Script
	 * @param hint Tooltip
	 */
	constructor(name: string, hint?: string) {

		super(undefined, name, hint)

		this.Update()

		Menu.AddEntry(this);
	}
}

let screepsInMenu: { [name: string]: MenuManager } = {};

export function MenuFactory(name: string, hint?: string) {
	
	let find = screepsInMenu[name];

	if (find !== undefined)
		return find;
	
	const factory = new MenuManager(name, hint);
		
	screepsInMenu[name] = factory;
	
	return factory;
}

export function CreateRGBTree(parent: MenuControllers.Tree, name: string, color: Color = new Color(0, 255, 0), hint?: string) {

	let tree = new MenuControllers.Tree(undefined, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)

	return {
		tree,
		R: tree.AddSlider("Color: R", color.r, 0, 255),
		G: tree.AddSlider("Color: G", color.g, 0, 255),
		B: tree.AddSlider("Color: B", color.b, 0, 255),
	}
}

export function CreateRGBATree(parent: MenuControllers.Tree, name: string, color: Color = new Color(0, 255, 0), hint?: string) {

	let tree = new MenuControllers.Tree(undefined, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)

	return {
		tree,
		R: tree.AddSlider("Color: R", color.r, 0, 255),
		G: tree.AddSlider("Color: G", color.g, 0, 255),
		B: tree.AddSlider("Color: B", color.b, 0, 255),
		A: tree.AddSlider("Alpha: A", color.a, 0, 255),
	}
}
