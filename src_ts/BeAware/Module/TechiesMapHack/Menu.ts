import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
const { BaseTree, State } = MenuBase(MapHack, "Techies Mine")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase(BaseTree,
	"Color", null, [],
	"Size", 32, 14, 100,
)
State.SetTooltip("Display position enemy heroes if use ability")
export { State, DrawRGBA, Size, ComboBox };
