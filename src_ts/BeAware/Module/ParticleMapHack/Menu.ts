import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"

const { BaseTree, State } = MenuBase(Menu, "Particle MapHack")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase (
	BaseTree,
	"Color", "Render Style",
	["Image", "Text"],
	"Size", 42, 42, 300,
)
State.SetTooltip("Display position enemy heroes if use ability")
let PMH_Smoke_snd = BaseTree.AddSliderFloat("Smoke volume", 1, 0, 100),
	PMH_Show_bounty = BaseTree.AddToggle('Show Bounty Runes On Map')
export { State, DrawRGBA, Size, ComboBox, PMH_Smoke_snd, PMH_Show_bounty }