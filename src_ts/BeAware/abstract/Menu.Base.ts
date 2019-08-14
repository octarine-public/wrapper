import { MenuManager } from "wrapper/Imports"
export const Menu = MenuManager.MenuFactory("Be Aware")
export const stateMain = Menu.AddToggle("State", false)

export function MenuBase(root: MenuManager.MenuControllers.Tree, name: string, tooltip?: string) {
	let BaseTree = root.AddTree(name)

	return {
		BaseTree,
		State: tooltip != undefined
			? BaseTree.AddToggle(BaseTree.name + " - State", true).SetToolTip(tooltip)
			: BaseTree.AddToggle(BaseTree.name + " - State", true),
	}
}
export function MenuDrawBase (
	root: MenuManager.MenuControllers.Tree,
	RGBname?: string,
	BoxName?: string,
	ArrayBox?: string[], 
	SliderName?: string,
	defaultValue?: number,
	minValue?: number,
	maxValue?: number
)  {
	let DrawTree = root.AddTree(root.name + " - Draw")
	return {
		DrawTree,
		Size: DrawTree.AddSlider(SliderName, defaultValue, minValue, maxValue),
		DrawRGBA: RGBname === null ? undefined : MenuManager.CreateRGBATree(DrawTree, root.name + " - " + RGBname),
		ComboBox: ArrayBox.length <= 0 ? undefined : DrawTree.AddComboBox(BoxName, ArrayBox),
	}
}