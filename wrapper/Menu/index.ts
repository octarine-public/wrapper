import { MenuManager } from "./Menu"
import { Node } from "./Node"

export { Base } from "./Base"
export { Button } from "./Button"
export { ColorPicker } from "./ColorPicker"
export { Dropdown } from "./Dropdown"
export { DynamicImageSelector } from "./DynamicImageSelector"
export { ImageSelector } from "./ImageSelector"
export { ImageSelectorArray } from "./ImageSelectorArr"
export * from "./ITypes"
export { KeyBind } from "./KeyBind"
export { Localization } from "./Localization"
export { ShortDescription } from "./ShortDescription"
export { Slider } from "./Slider"
export { Toggle } from "./Toggle"
export { Node }
function AddEntry(name: string, iconPath = "", tooltip = "", iconRound = -1): Node {
	return MenuManager.AddEntry(name, iconPath, tooltip, iconRound)
}
function AddEntryDeep(name: string[], iconPath: string[] = []): Node {
	return MenuManager.AddEntryDeep(name, iconPath)
}
export { AddEntry, AddEntryDeep, MenuManager }
