import { Menu as MenuSDK } from "wrapper/Imports"
export const Menu = MenuSDK.AddEntry(["Visual", "Be Aware"])
export const stateMain = Menu.AddToggle("State", true)

export function MenuBase(root: MenuSDK.Node, name: string, tooltip?: string) {
	let BaseTree = root.AddNode(name)

	return {
		BaseTree,
		State: tooltip !== undefined
			? BaseTree.AddToggle("State", true).SetTooltip(tooltip)
			: BaseTree.AddToggle("State", true),
	}
}
export function MenuDrawBase(
	root: MenuSDK.Node,
	RGBname?: string,
	BoxName?: string,
	ArrayBox?: string[],
	SliderName?: string,
	defaultValue?: number,
	minValue?: number,
	maxValue?: number,
)  {
	let DrawTree = root
	return {
		DrawTree,
		Size: DrawTree.AddSlider(SliderName, defaultValue, minValue, maxValue),
		DrawRGBA: RGBname === null ? undefined : DrawTree.AddColorPicker(RGBname),
		ComboBox: ArrayBox.length <= 0 ? undefined : DrawTree.AddSwitcher(BoxName, ArrayBox),
	}
}
