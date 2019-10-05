import { Menu, MenuBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Enemy Lane Selection")

let //ShowAfterGameStart = BaseTree.AddToggle("Show after game start", true),
	//DrawTextSize = BaseTree.AddSlider("Text Size", 23, 12, 60),
	BaseTreeChat = BaseTree.AddNode("Chat Settings"),
	SendAlliesChat = BaseTreeChat.AddToggle("Send allies chat role enemy"),
	ChatTimeOutSend = BaseTreeChat.AddSlider("Delay at send message chat", 6, 1, 60),
	ChatTimeOutSendRepeat = BaseTreeChat.AddButton("Repeat message"),
	BaseTreeDraw = BaseTree.AddNode("Draw Settings"),
	DrawPositionX = BaseTreeDraw.AddSlider("Position X", 84, -900, 900),
	DrawPositionY = BaseTreeDraw.AddSlider("Position Y", 84, -900, 900)

	
export { 
	State, BaseTree, 
	//ShowAfterGameStart,
	DrawPositionX, DrawPositionY, SendAlliesChat, ChatTimeOutSend, ChatTimeOutSendRepeat //DrawTextSize 
}