export { default as Base } from "./Base"

export { default as ImageSelector } from "./ImageSelector"
export { default as Slider } from "./Slider"
export { default as Switcher } from "./Switcher"
export { default as Toggle } from "./Toggle"
export { default as Button } from "./Button"
export { default as KeyBind } from "./KeyBind"
export { default as Localization } from "./Localization"
export * from "./ITypes"

import Node from "./Node"
export { Node }

import MenuManager from "./Menu"
function AddEntry(name: string | string[], icon_path = ""): Node {
	return MenuManager.AddEntry(name, icon_path)
}
export { MenuManager, AddEntry }
