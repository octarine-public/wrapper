import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
const { BaseTree, State } = MenuBase(MapHack, "Jungle")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase(BaseTree,
	"Color", "Render Style",
	["Dot", "Dot 2", "Stars", "Stars 2", "Snowflake", "Rhomb", "Cross", "Double square"],
	"Size", 64, 24, 300,
)
State.SetTooltip("Display position who farming jungle or hit roshan")
export { State, DrawRGBA, Size, ComboBox };
