import Vector2 from "../Base/Vector2";
import Vector3 from "../Base/Vector3";
import Color from "../Base/Color";

import * as MenuControllers from "./Tree"

import RendererSDK from "../Native/Renderer";

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

let screepsInMenu = new Map<string, MenuManager>();

export function MenuFactory(name: string, hint?: string) {
	
	let find = screepsInMenu.get(name);

	if (find !== undefined)
		return find;
	
	const factory = new MenuManager(name, hint);
		
	screepsInMenu.set(name, factory);
	
	return factory;
}

export function CreateTextSizeTree(parent: MenuControllers.Tree, name: string, size: Vector2 | Vector3 = RendererSDK.DefaultTextSize, hint?: string) {

	let tree = new MenuControllers.Tree(parent, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)
	
	const Size = tree.AddSlider("Size: Size", size.x, 0, 255);
	const Weight = tree.AddSlider("Size: Weight", size.y, 0, 65535);
		
	return {
		tree,
		Size, Weight,
		get SizeVector(): Vector2 {
			return new Vector2(Size.value, Weight.value);
		}
	}
}

export function CreateRGBTree(parent: MenuControllers.Tree, name: string, color: Color = new Color(0, 255, 0), hint?: string) {

	let tree = new MenuControllers.Tree(parent, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)
	
	const R = tree.AddSlider("Color: R", color.r, 0, 255);
	const G = tree.AddSlider("Color: G", color.g, 0, 255);
	const B = tree.AddSlider("Color: B", color.b, 0, 255);
		
	return {
		tree,
		R, G, B,
		get Color(): Color {
			return new Color(R.value, G.value, B.value);
		}
	}
}

export function CreateRGBATree(parent: MenuControllers.Tree, name: string, color: Color = new Color(0, 255, 0), hint?: string) {

	let tree = new MenuControllers.Tree(parent, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)
	
	const R = tree.AddSlider("Color: R", color.r, 0, 255);
	const G = tree.AddSlider("Color: G", color.g, 0, 255);
	const B = tree.AddSlider("Color: B", color.b, 0, 255);
	const A = tree.AddSlider("Alpha: A", color.a, 0, 255);

	return {
		tree,
		R, G, B, A,
		get Color(): Color {
			return new Color(R.value, G.value, B.value, A.value);
		}
	}
}
