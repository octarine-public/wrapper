export { Base } from "./Base"

export { DynamicImageSelector } from "./DynamicImageSelector"
export { ImageSelector } from "./ImageSelector"
export { Slider } from "./Slider"
export { Dropdown } from "./Dropdown"
export { Toggle } from "./Toggle"
export { Button } from "./Button"
export { KeyBind } from "./KeyBind"
export { ColorPicker } from "./ColorPicker"
export { Localization } from "./Localization"
export * from "./ITypes"

import { Node } from "./Node"
export { Node }

import { MenuManager } from "./Menu"
function AddEntry(name: string, icon_path = "", tooltip = "", icon_round = -1): Node {
	return MenuManager.AddEntry(name, icon_path, tooltip, icon_round)
}
function AddEntryDeep(name: string[], icon_path: string[] = []): Node {
	return MenuManager.AddEntryDeep(name, icon_path)
}
export { MenuManager, AddEntry, AddEntryDeep }
