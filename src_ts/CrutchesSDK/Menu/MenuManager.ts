import Tree from "./Tree"

class MenuManager extends Tree {

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

let screepsInMenu: Tree[] = [];

export function MenuFactory(name: string, hint?: string) {
	
	let find = screepsInMenu[name] as MenuManager;

	if (find !== undefined)
		return find;
	
	const factory = new MenuManager(name, hint);
		
	screepsInMenu[name] = factory;
	
	return factory;
}

export function CreateRGBTree(parent: Tree, name: string, color: Vector3 = new Vector3(0, 255, 0), hint?: string) {

	let tree = new Tree(undefined, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)

	return {
		tree,
		R: tree.AddSlider("Color: R", color.x, 0, 255),
		G: tree.AddSlider("Color: G", color.y, 0, 255),
		B: tree.AddSlider("Color: B", color.z, 0, 255),
	}
}

export function CreateRGBATree(parent: Tree, name: string, color: Vector3 = new Vector3(0, 255, 0), alpha: number = 255, hint?: string) {

	let tree = new Tree(undefined, name, hint)

	if (parent !== undefined)
		parent.AddControl(tree)

	return {
		tree,
		R: tree.AddSlider("Color: R", color.x, 0, 255),
		G: tree.AddSlider("Color: G", color.y, 0, 255),
		B: tree.AddSlider("Color: B", color.z, 0, 255),
		A: tree.AddSlider("Alpha: A", alpha, 0, 255),
	}
}
