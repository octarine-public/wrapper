import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"

const { BaseTree, State } = MenuBase(Menu, "Particle MapHack")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase (
	BaseTree,
	"Color", "Render Style",
	["Image", "Text"],
	"Size", 42, 42, 300,
)
State.SetToolTip("Display position enemy heroes if use ability")
export { State, DrawRGBA, Size, ComboBox }