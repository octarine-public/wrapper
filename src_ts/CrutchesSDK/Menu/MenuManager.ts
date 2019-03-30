import Tree from "./Tree";

export default class MenuManager extends Tree {

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