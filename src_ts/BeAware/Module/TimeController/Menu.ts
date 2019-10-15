import { Menu, MenuBase } from "../../abstract/Menu.Base";
import { Color } from "wrapper/Imports";
let Building = Menu.AddNode("Building")
const { BaseTree, State } = MenuBase(Building, "Time Controller")
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
	DrawTextColorShrineIsReady = ShrineTree.AddColorPicker("Text Color IsReady", new Color(0, 255, 0))
	
let RadarTree = BaseTree.AddNode("Scan"),
	RadarState = RadarTree.AddToggle("Enable", true),
	
	RadarInWorld = RadarTree.AddNode("Scan in World"),
	RadarStateInWorld = RadarInWorld.AddToggle("Enable", true),
	RadarStateInWorldTextSize = RadarInWorld.AddSlider("Text Size", 20, 14, 60),
	RadarStateInWorldTextColor = RadarInWorld.AddColorPicker("Text Color", new Color(255,255,255)),
	RadarStateInWorldMiniMapColor = RadarInWorld.AddColorPicker("Scan Color MiniMap", new Color(0, 255, 0)),
	RadarStateInWorldIconSize = RadarInWorld.AddSlider("Icon Size", 54, 32, 150),
	RadarStateInWorldSound = RadarInWorld.AddSlider("Sound volume", 1, 0, 100),
	
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
