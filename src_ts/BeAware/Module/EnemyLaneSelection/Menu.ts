import { Menu, MenuBase } from "../../abstract/Menu.Base"
let { BaseTree, State } = MenuBase(Menu, "Enemy Lane Selection")

// Enemy Lane Selection
let //ShowAfterGameStart = BaseTree.AddToggle("Show after game start", true),
	//DrawTextSize = BaseTree.AddSlider("Text Size", 23, 12, 60),
	BaseTreeChat = BaseTree.AddNode("Chat Settings"),
	SendAlliesChat = BaseTreeChat.AddToggle("Send enemy roles to chat", false),
	ChatTimeOutSend = BaseTreeChat.AddSlider("Chat delay", 6, 1, 60),
	ChatTimeOutSendRepeat = BaseTreeChat.AddButton("Repeat message"),
	BaseTreeDraw = BaseTree.AddNode("Draw Settings"),
	DrawPositionX = BaseTreeDraw.AddSlider("Position X", 84, -900, 900),
	DrawPositionY = BaseTreeDraw.AddSlider("Position Y", 84, -900, 900),
	DrawPositionGap = BaseTreeDraw.AddSlider("Players gap", 140, 0, 900)

export {
	State, BaseTree,
	//ShowAfterGameStart,
	DrawPositionGap,
	DrawPositionX, DrawPositionY, SendAlliesChat, ChatTimeOutSend, ChatTimeOutSendRepeat //DrawTextSize
}
