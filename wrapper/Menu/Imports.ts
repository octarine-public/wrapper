export { default as Base } from "./Base"

export { default as DynamicImageSelector } from "./DynamicImageSelector"
export { default as ImageSelector } from "./ImageSelector"
export { default as Slider } from "./Slider"
export { default as Dropdown } from "./Dropdown"
export { default as Toggle } from "./Toggle"
export { default as Button } from "./Button"
export { default as KeyBind } from "./KeyBind"
export { default as ColorPicker } from "./ColorPicker"
export { default as Localization } from "./Localization"
export * from "./ITypes"

import Node from "./Node"
export { Node }

import MenuManager from "./Menu"
function AddEntry(name: string, icon_path = ""): Node {
	return MenuManager.AddEntry(name, icon_path)
}
function AddEntryDeep(name: string[], icon_path: string[] = []): Node {
	return MenuManager.AddEntryDeep(name, icon_path)
}
export { MenuManager, AddEntry, AddEntryDeep }
