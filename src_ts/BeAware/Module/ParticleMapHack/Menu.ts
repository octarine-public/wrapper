import { Color } from "wrapper/Imports"
import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base"
let MapHack = Menu.AddNode("MapHack")
const { BaseTree, State } = MenuBase(MapHack, "Particle")
const { DrawRGBA, Size, ComboBox } = MenuDrawBase(
	BaseTree,
	"Color", "Render Style",
	[
		"Image", 
		"Text"
	],
	"Image/Text Size", 42, 42, 300,
)
State.SetTooltip("Display position enemy heroes if use ability")
let PMH_Smoke_snd = BaseTree.AddSliderFloat("Smoke volume%", 1, 0, 100)

let TreeSpecial = Menu.AddNode("Time Controller"),
	TreeRune = TreeSpecial.AddNode("Runes"),
	TreePower = TreeRune.AddNode("Power Runes"),
	TreeRuneState = TreePower.AddToggle("Enable", true),
	NotifyPowerRune = TreePower.AddSlider("For what time to notify?", 10, 1, 30),
	TreeNotificationPowerChat = TreePower.AddToggle("Notify allies", false),
	TreeNotificationPowerDrawMap = TreePower.AddToggle("Draw minimap", true),
	TreeNotificationPowerSound = TreePower.AddSlider("Sound volume%", 1, 0, 100),
	
	TreeBounty = TreeRune.AddNode("Bounty Runes"),
	PMH_Show_bounty = TreeBounty.AddToggle("Enable", true),
	NotifyTimeBounty = TreeBounty.AddSlider("For what time to notify?", 10, 1, 30),
	TreeNotificationBountyChat = TreeBounty.AddToggle("Notify allies", false),
	TreeNotificationBountySound = TreeBounty.AddSlider("Sound volume%", 1, 0, 100),
	
	DrawTreeBounty = TreeBounty.AddNode("Draw Settings"),
	PMH_Show_bounty_size = DrawTreeBounty.AddSliderFloat("Bounty Runes Size", 42, 24, 300),
	TreeNotificationBountyDrawMap = DrawTreeBounty.AddToggle("Draw minimap", true),
	PMH_Show_bountyRGBA = DrawTreeBounty.AddColorPicker("Color image", new Color(255, 255, 0, 255)),
	PMH_Show_bountyRGBA_mark = DrawTreeBounty.AddColorPicker("Mark Color", new Color(0, 255, 0, 255))

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

export {
	TreeRuneState,
	NotifyPowerRune,
	TreeNotificationPowerChat,
	TreeNotificationPowerDrawMap,
	TreeNotificationPowerSound,
	
	TreeNotificationBountyDrawMap,
	TreeNotificationBountyChat,
	NotifyTimeBounty,
	TreeNotificationBountySound,
}