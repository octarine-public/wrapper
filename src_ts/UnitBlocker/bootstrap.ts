import { EventsSDK, Game, RendererSDK } from "../CrutchesSDK/Imports";

import { stateMain } from "./menu";
import * as CreepBlock from "./modules/CreepBlock";


EventsSDK.on("onTick", () => {
	if (!stateMain.value || !Game.IsInGame || Game.IsPaused)
		return;
	
	CreepBlock.Update();
})

EventsSDK.on("onDraw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return;
	
	let textAroundMouse = "";
	
	textAroundMouse += CreepBlock.Draw();
		
	// another

	if (textAroundMouse === "")
		return;
		
	RendererSDK.TextAroundMouse(textAroundMouse);
})