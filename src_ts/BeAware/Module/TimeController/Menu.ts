import { Menu, MenuBase } from "../../abstract/Menu.Base";
import { Color } from "wrapper/Imports";
const { BaseTree, State } = MenuBase(Menu, "Time Controller")


let TreeRune = BaseTree.AddNode("Runes"),
	TreePower = TreeRune.AddNode("Power Runes"),
	TreeRuneState = TreePower.AddToggle("Enable", true),
	NotifyPowerRuneTree = TreePower.AddNode("For what time to notify?"),
	NotifyPowerRuneMin = NotifyPowerRuneTree.AddSlider("Min", 5, 2, 30),
	NotifyPowerRuneMax = NotifyPowerRuneTree.AddSlider("Max", 10, 2, 30),
	TreeNotificationPowerChat = TreePower.AddToggle("Notify allies", false),
	TreeNotificationPowerDrawMap = TreePower.AddToggle("Draw minimap", true),
	TreeNotificationPowerSound = TreePower.AddSlider("Sound volume%", 1, 0, 100),

	TreeBounty = TreeRune.AddNode("Bounty Runes"),
	PMH_Show_bounty = TreeBounty.AddToggle("Enable", true),
	NotifyTimeBountyTree = TreeBounty.AddNode("For what time to notify?"),
	NotifyTimeBountyMin = NotifyTimeBountyTree.AddSlider("Min", 5, 2, 30),
	NotifyTimeBountyMax = NotifyTimeBountyTree.AddSlider("Max", 10, 2, 30),
	TreeNotificationBountyChat = TreeBounty.AddToggle("Notify allies", false),
	TreeNotificationBountySound = TreeBounty.AddSlider("Sound volume%", 1, 0, 100),

	DrawTreeBounty = TreeBounty.AddNode("Draw Settings"),
	PMH_Show_bounty_size = DrawTreeBounty.AddSliderFloat("Bounty Runes Size", 42, 24, 300),
	TreeNotificationBountyDrawMap = DrawTreeBounty.AddToggle("Draw minimap", true),
	PMH_Show_bountyRGBA = DrawTreeBounty.AddColorPicker("Color image", new Color(255, 255, 0, 255)),
	PMH_Show_bountyRGBA_mark = DrawTreeBounty.AddColorPicker("Mark Color", new Color(0, 255, 0, 255))

export {
	// Size,
	// State,
	// DrawRGBA,
	// ComboBox,
	// PMH_Smoke_snd,
	PMH_Show_bounty,
	PMH_Show_bountyRGBA,
	PMH_Show_bounty_size,
	PMH_Show_bountyRGBA_mark,
}

export {
	TreeRuneState,
	NotifyPowerRuneMin,
	NotifyPowerRuneMax,
	TreeNotificationPowerChat,
	TreeNotificationPowerDrawMap,
	TreeNotificationPowerSound,

	TreeNotificationBountyDrawMap,
	TreeNotificationBountyChat,
	NotifyTimeBountyMin,
	NotifyTimeBountyMax,
	TreeNotificationBountySound,
}

let RoshanTree = BaseTree.AddNode("Roshan")
let NotificationRoshanStateChat = RoshanTree.AddToggle("Chat").SetTooltip("Send notification to chat alies"),
	NotificationRoshanStateSound = RoshanTree.AddSlider("Sound volume%", 1, 0, 100),
	drawMenu = RoshanTree.AddNode("Draw Settings"),
	drawStatus = drawMenu.AddToggle("Draw status", true),
	IconSettingsTree = drawMenu.AddNode("Icon Settings"),

	AegisSettingsTree = drawMenu.AddNode("Aegis Settings"),
	AegisSettingsState = AegisSettingsTree.AddToggle("Timer aegis", true),
	AegisSettingsStateIcon = AegisSettingsTree.AddToggle("Icon Aegis", true),
	AegisdrawStatusSize = AegisSettingsTree.AddSlider("Text Size", 23, 12, 60),
	AegisStatusPosX = AegisSettingsTree.AddSlider("Position X (%)", 47, 0, 100),
	AegisStatusPosY = AegisSettingsTree.AddSlider("Position Y (%)", 4, 0, 100),

	IconSettingsState = IconSettingsTree.AddToggle("Icon Enable", true),
	IconSettingsSwitch = IconSettingsTree.AddSwitcher("Icon Style", ["Low quality", "High quality"]),
	IconSettingsColorDied = IconSettingsTree.AddColorPicker("Color Died", new Color(255, 0, 0, 255)),
	IconSettingsColorAlive = IconSettingsTree.AddColorPicker("Color Alive", new Color(14, 255, 14, 255)),

	drawStatusSize = drawMenu.AddSlider("Text Size", 23, 12, 60),
	statusPosX = drawMenu.AddSlider("Position X (%)", 47, 0, 100),
	statusPosY = drawMenu.AddSlider("Position Y (%)", 4, 0, 100)
	
export {
	BaseTree,
	NotificationRoshanStateChat,
	drawStatus,
	statusPosX,
	statusPosY,
	drawStatusSize
}

export {
	IconSettingsState,
	IconSettingsColorDied,
	IconSettingsColorAlive,
	IconSettingsSwitch,

	AegisStatusPosX,
	AegisStatusPosY,
	AegisSettingsState,
	AegisdrawStatusSize,
	AegisSettingsStateIcon,
	NotificationRoshanStateSound,
}

let GliphTree = BaseTree.AddNode("Glyph"),
	GliphState = GliphTree.AddToggle("Enable", true),
	
	GliphTreeIcon = GliphTree.AddNode("Icon Settings"),
	GliphStateIcon = GliphTreeIcon.AddToggle("Icon Enable", true),
	GliphStateIconColor = GliphTreeIcon.AddColorPicker("Icon Color", new Color(255, 255, 255)),

	GliphInRange = GliphTree.AddSlider("In Range from me", 1800, 600, 5000),
	GliphSwitcher = GliphTree.AddSwitcher("Select", ["Creeps and Building", "Only Creeps", "Only Building"], 0),
	GliphSwitcherTeam = GliphTree.AddSwitcher("Select", ["Enemy and Allies", "Only Allies", "Only Enemy"], 2)

let DrawingSettings = GliphTree.AddNode("Draw Settings"),
	DrawTextSize = DrawingSettings.AddSlider("Text Size", 23, 12, 60),
	DrawTextColor = DrawingSettings.AddColorPicker("Text Color", new Color(255, 255, 255)),
	
	DrawTimerGliph = DrawingSettings.AddNode("Enemy Gliph Timer"),
	DrawTimerGliphState = DrawTimerGliph.AddToggle("Enable", true),
	DrawTimerGliphX = DrawTimerGliph.AddSliderFloat("X", 16, 0, 100),
	DrawTimerGliphY = DrawTimerGliph.AddSliderFloat("Y", 96, 0, 100),
	DrawTimerGliphSize = DrawTimerGliph.AddSliderFloat("Text Size", 20, 12, 60)

let ShrineTree = BaseTree.AddNode("Shrine"),
	ShrineState = ShrineTree.AddToggle("Enable", true),
	
	ShrineTreeIcon = ShrineTree.AddNode("Icon Settings"),
	ShrineStateIcon = ShrineTreeIcon.AddToggle("Icon Enable", true),
	ShrineStateIconColor = ShrineTreeIcon.AddColorPicker("Icon Color", new Color(255, 255, 255)),
	
	DrawTextSizeShrine = ShrineTree.AddSlider("Text Size", 23, 12, 60),
	DrawEnemyOrAllies = ShrineTree.AddSwitcher("Select", ["Enemy and Allies", "Only Allies", "Only Enemy"], 1),
	DrawTextColorShrine = ShrineTree.AddColorPicker("Text Color", new Color(255, 255, 255)),
	DrawTextColorShrineIsReady = ShrineTree.AddColorPicker("Text Color Ready", new Color(0, 255, 0))
	
let RadarTree = BaseTree.AddNode("Scan"),
	RadarState = RadarTree.AddToggle("Enable", true),
	
	RadarInWorld = RadarTree.AddNode("Scan in World"),
	RadarStateInWorld = RadarInWorld.AddToggle("Enable", true),
	RadarStateInWorldTextSize = RadarInWorld.AddSlider("Text Size", 20, 14, 60),
	RadarStateInWorldTextColor = RadarInWorld.AddColorPicker("Text Color", new Color(255,255,255)),
	RadarStateInWorldMiniMapColor = RadarInWorld.AddColorPicker("Scan Color MiniMap", new Color(0, 255, 0)),
	RadarStateInWorldIconSize = RadarInWorld.AddSlider("Icon Size", 54, 32, 150),
	RadarStateInWorldSound = RadarInWorld.AddSlider("Sound volume%", 1, 0, 100),
	
	RadarTreeSettings = RadarTree.AddNode("Enemy Scan Timer"),
	RadarTreeSettingsState = RadarTreeSettings.AddToggle("Enable", true),
	DrawTimerRadarX = RadarTreeSettings.AddSliderFloat("X", 16, 0, 100),
	DrawTimerRadarY = RadarTreeSettings.AddSliderFloat("Y", 92, 0, 100),
	DrawTimerRadarSize = RadarTreeSettings.AddSliderFloat("Text Size", 20, 12, 60)

export { 
	State, 
	GliphState,
	GliphStateIcon,
	GliphStateIconColor,
	GliphSwitcher, 
	GliphSwitcherTeam, 
	GliphInRange, 
	DrawTextSize, 
	DrawTextColor, 
	DrawTimerGliphX,
	DrawTimerGliphY,
	DrawTimerGliphState,
	DrawTimerGliphSize
}

export { 
	ShrineState,
	ShrineStateIcon,
	DrawTextSizeShrine,
	DrawTextColorShrine,
	ShrineStateIconColor,
	DrawEnemyOrAllies,
	DrawTextColorShrineIsReady,
	
	RadarStateInWorld,
	RadarStateInWorldSound,
	RadarStateInWorldTextSize,
	RadarStateInWorldIconSize,
	RadarStateInWorldTextColor,
	RadarStateInWorldMiniMapColor
}

export {
	RadarState,
	DrawTimerRadarX,
	DrawTimerRadarY,
	RadarTreeSettingsState,
	DrawTimerRadarSize
}
