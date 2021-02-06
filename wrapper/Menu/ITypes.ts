import ColorPicker from "./ColorPicker"
import Dropdown from "./Dropdown"
import Node from "./Node"
import Slider from "./Slider"
import Toggle from "./Toggle"

export interface IMenuParticlePicker {
	Node: Node
	State: Nullable<Toggle>
	Color: ColorPicker
	Width: Slider
	Style: Dropdown
}
