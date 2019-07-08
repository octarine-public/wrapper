import { EventsSDK, Game, GameSleeper, RendererSDK } from "wrapper/Imports"

import * as DrawParticle from "./base/DrawParticle"
import { stateMain } from "./base/MenuBase"

import * as CreepBlock from "./modules/CreepBlock/Block"
import * as HeroBlock from "./modules/HeroBlock/Block"

EventsSDK.on("GameStarted", () => {
	CreepBlock.GameStarted()
})

EventsSDK.on("GameEnded", () => {
	DrawParticle.GameEnded()
	CreepBlock.GameEnded()
	HeroBlock.GameEnded()
})

EventsSDK.on("Tick", () => {
	if (!stateMain.value || !Game.IsInGame || Game.IsPaused)
		return

	CreepBlock.Update()
	HeroBlock.Update()
})

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return

	let textAroundMouse = ""

	textAroundMouse += CreepBlock.Draw() || ""

	textAroundMouse += HeroBlock.Draw() || ""

	if (textAroundMouse === "")
		return

	RendererSDK.TextAroundMouse(textAroundMouse)
})