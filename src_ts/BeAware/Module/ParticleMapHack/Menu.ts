import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
const { BaseTree, State } = MenuBase(MapHack, "Particle")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase(
	BaseTree,
	"Color", "Render Style",
	[
		"Image",
		"Text",
	],
	"Image/Text Size", 42, 42, 300,
)
State.SetTooltip("Display position enemy heroes if use ability")
let PMH_Smoke_snd = BaseTree.AddSliderFloat("Smoke volume%", 1, 0, 100)

export {
	Size,
	State,
	DrawRGBA,
	ComboBox,
	PMH_Smoke_snd
}