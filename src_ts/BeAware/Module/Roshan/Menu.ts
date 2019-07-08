import { Menu, MenuBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Roshan")

const NotificationRoshanStateChat = BaseTree.AddToggle("Chat").SetToolTip("Send notification to chat alies"),
	drawMenu = BaseTree.AddTree("Draw roshan"),
	drawStatus = drawMenu.AddToggle("Draw status"),
	statusPosX = drawMenu.AddSlider("Position X (%)", 47, 0, 100),
	statusPosY = drawMenu.AddSlider("Position Y (%)", 4, 0, 100),
	IsAlive = drawMenu.AddCheckBox("IsAlive").SetToolTip("don't pick, crutch for save last alive rosh, if execute full reload scripts")

export { State, BaseTree, NotificationRoshanStateChat, drawStatus, statusPosX, statusPosY, IsAlive};
