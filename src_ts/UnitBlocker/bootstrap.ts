import { EventsSDK, GameState, RendererSDK, DOTAGameUIState_t, GameRules } from "wrapper/Imports"
import { RemoveParticles, DrawParticles } from "./modules/CreepBlock/ParticleHelp"

import * as DrawParticle from "./base/DrawParticle"
import { stateMain } from "./base/MenuBase"

import * as CreepBlock from "./modules/CreepBlock/Block"
import * as HeroBlock from "./modules/HeroBlock/Block"

EventsSDK.on("GameEnded", () => {
	DrawParticle.GameEnded()
	CreepBlock.GameEnded()
	HeroBlock.GameEnded()
	RemoveParticles()
})

EventsSDK.on("Tick", () => {
	if (GameRules!.RawGameTime > 300)
		RemoveParticles()
	else
		DrawParticles()
	if (!stateMain.value)
		return

	CreepBlock.Update()
	HeroBlock.Update()
})

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !GameRules?.IsInGame || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return

	let textAroundMouse = ""

	textAroundMouse += CreepBlock.Draw() ?? ""

	textAroundMouse += HeroBlock.Draw() ?? ""

	if (textAroundMouse === "")
		return

	RendererSDK.TextAroundMouse(textAroundMouse)
})
