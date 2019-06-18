import { EventsSDK, Game, RendererSDK, GameSleeper } from "../CrutchesSDK/Imports";

import { stateMain } from "./base/MenuBase";
import * as DrawParticle from "./base/DrawParticle";

import * as CreepBlock from "./modules/CreepBlock/Block";
import * as HeroBlock from "./modules/HeroBlock/Block";

EventsSDK.on("onGameStarted", () => {
	CreepBlock.GameStarted();
});

EventsSDK.on("onGameEnded", () => {
	DrawParticle.GameEnded();
	CreepBlock.GameEnded();
	HeroBlock.GameEnded();
})

EventsSDK.on("onTick", () => {
	if (!stateMain.value || !Game.IsInGame || Game.IsPaused)
		return;
	
	CreepBlock.Update();
	HeroBlock.Update();
})

EventsSDK.on("onDraw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return;
	
	let textAroundMouse = "";
	
	textAroundMouse += CreepBlock.Draw() || "";
		
	textAroundMouse += HeroBlock.Draw() || "";

	if (textAroundMouse === "")
		return;
		
	RendererSDK.TextAroundMouse(textAroundMouse);
})