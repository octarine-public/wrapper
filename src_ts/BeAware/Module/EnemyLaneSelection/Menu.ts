import { Menu, MenuBase } from "../../abstract/Menu.Base"
let Special = Menu.AddNode("Special")
let { BaseTree, State } = MenuBase(Special, "Enemy Lane Selection")
// Enemy Lane Selection
let //ShowAfterGameStart = BaseTree.AddToggle("Show after game start", true),
	//DrawTextSize = BaseTree.AddSlider("Text Size", 23, 12, 60),
	BaseTreeChat = BaseTree.AddNode("Chat Settings"),
	SendAlliesChat = BaseTreeChat.AddToggle("Send allies chat role enemy"),
	ChatTimeOutSend = BaseTreeChat.AddSlider("Delay at send message chat", 6, 1, 60),
	ChatTimeOutSendRepeat = BaseTreeChat.AddButton("Repeat message"),
	BaseTreeDraw = BaseTree.AddNode("Draw Settings"),
	DrawPositionX = BaseTreeDraw.AddSlider("Position X", 84, -900, 900),
	DrawPositionY = BaseTreeDraw.AddSlider("Position Y", 84, -900, 900),
	DrawPositionGap = BaseTreeDraw.AddSlider("Gap between role", 140, 0, 900)

	
export { 
	State, BaseTree, 
	//ShowAfterGameStart,
	DrawPositionGap,
	DrawPositionX, DrawPositionY, SendAlliesChat, ChatTimeOutSend, ChatTimeOutSendRepeat //DrawTextSize 
}