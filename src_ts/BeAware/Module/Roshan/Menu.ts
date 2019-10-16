import { Menu, MenuBase } from "../../abstract/Menu.Base"
import { Color } from "wrapper/Imports";
let Special = Menu.AddNode("Time Controller")
const { BaseTree, State } = MenuBase(Special, "Roshan")

let NotificationRoshanStateChat = BaseTree.AddToggle("Chat").SetTooltip("Send notification to chat alies"),
	NotificationRoshanStateSound = BaseTree.AddSlider("Sound volume%", 1, 0, 100),
	drawMenu = BaseTree.AddNode("Draw Settings"),
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
	statusPosY = drawMenu.AddSlider("Position Y (%)", 4, 0, 100),
	IsAlive = drawMenu.AddToggle("IsAlive").SetTooltip("don't pick, crutch for save last alive rosh, if execute full reload scripts")

export { 
	State, 
	BaseTree, 
	NotificationRoshanStateChat, 
	drawStatus, 
	statusPosX, 
	statusPosY, 
	IsAlive, 
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
