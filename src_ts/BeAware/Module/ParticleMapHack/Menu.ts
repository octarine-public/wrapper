import { Color } from "wrapper/Imports"
import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"

const { BaseTree, State } = MenuBase(Menu, "Particle MapHack")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase (
	BaseTree,
	"Color", "Render Style",
	["Image", "Text"],
	"Size", 42, 42, 300,
)
State.SetTooltip("Display position enemy heroes if use ability")
let PMH_Smoke_snd = BaseTree.AddSliderFloat("Smoke volume", 1, 0, 100)

let TreeBounty = BaseTree.AddNode("Bounty Settings"),
	PMH_Show_bounty = TreeBounty.AddToggle("Show Bounty Runes"),
	PMH_Show_bounty_size = TreeBounty.AddSliderFloat("Bounty Runes Size", 42, 24, 300),
	PMH_Show_bountyRGBA = TreeBounty.AddColorPicker("Color image", new Color(255, 255, 0, 255)),
	PMH_Show_bountyRGBA_mark = TreeBounty.AddColorPicker("Mark Color", new Color(0, 255, 0, 255))

export {
	Size,
	State,
	DrawRGBA,
	ComboBox,
	PMH_Smoke_snd,
	PMH_Show_bounty,
	PMH_Show_bountyRGBA,
	PMH_Show_bounty_size,
	PMH_Show_bountyRGBA_mark,
}
