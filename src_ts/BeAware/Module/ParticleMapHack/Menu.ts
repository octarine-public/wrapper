import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"

const { BaseTree, State } = MenuBase(Menu, "Particle MapHack")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase (
	BaseTree,
	"Color", "Render Style",
	["Image", "Text"],
	"Size", 64, 64, 300,
)
State.SetToolTip("Display position enemy heroes if use ability")
let IconLifetime = BaseTree.AddSliderFloat("Icon lifetime", 3, 0.5, 15, "Lifetime of icon at minimap/world")
export { State, DrawRGBA, Size, ComboBox, IconLifetime }
