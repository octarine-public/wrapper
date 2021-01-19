import Color from "../Base/Color"
import Dropdown from "./Dropdown"
import Node from "./Node"
import Slider from "./Slider"
import Toggle from "./Toggle"

export interface IMenuParticlePicker {
	Node: Node
	State: Nullable<Toggle>
	R: Slider
	G: Slider
	B: Slider
	A: Slider
	Width: Slider
	Style: Dropdown
	Color: Color
}
