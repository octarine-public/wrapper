export { default as Base } from "./Base"

export { default as Header } from "./Header"
export { default as ImageSelector } from "./ImageSelector"
export { default as Slider } from "./Slider"
export { default as Switcher } from "./Switcher"
export { default as Toggle } from "./Toggle"
export { default as Button } from "./Button"
export { default as KeyBind } from "./KeyBind"

import Node from "./Node"
export { Node }

import MenuManager from "./Menu"
function AddEntry(name: string | string[]): Node {
	return MenuManager.AddEntry(name)
}
export { MenuManager, AddEntry }
