import Tree from "./Tree";

export class MenuManager extends Tree {

	/**
	 * 
	 * @param name Name of Script
	 * @param hint Tooltip
	 */
	constructor(name: string, hint?: string) {
		
		super(undefined, name, hint);
		
		this.Update();
		
		Menu.AddEntry(this);
	}
}

export function CreateRGBTree(parent: Tree, name: string, color: Vector = new Vector(0, 255, 0), hint?: string) {
	
	let tree = new Tree(undefined, name, hint);
	
	if (parent !== undefined)
		parent.AddControl(tree);
	
	return {
		tree,
		R: tree.AddSlider("Color: R", color.x, 0, 255),
		G: tree.AddSlider("Color: G", color.y, 0, 255),
		B: tree.AddSlider("Color: B", color.z, 0, 255)
	};
}