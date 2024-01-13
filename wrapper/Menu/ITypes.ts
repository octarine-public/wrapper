import { ColorPicker } from "./ColorPicker"
import { Dropdown } from "./Dropdown"
import { Node } from "./Node"
import { Toggle } from "./Toggle"

export interface IMenuParticlePicker {
	Node: Node
	State: Nullable<Toggle>
	Color: ColorPicker
	Fill: Toggle
	Style: Dropdown
}
