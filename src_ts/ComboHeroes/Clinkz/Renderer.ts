import { Game, GameSleeper, LocalPlayer, ParticlesSDK, Vector3 } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { MouseTarget, Owner } from "./Listeners"
import { DrawTargetItem, State } from "./Menu"

let targetParticle: number
let Sleep = new GameSleeper()

export function Draw() {
	if (LocalPlayer === undefined)
		return false
	if (!Base.IsRestrictions(State) || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator)
		return false
	// Target
	if (DrawTargetItem.value) {
		if (targetParticle === undefined && MouseTarget !== undefined)
			targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, MouseTarget)
		if (targetParticle !== undefined)
			DrawTarget()
	}
}

function DrawTarget() {
	if (MouseTarget === undefined) {
		ParticlesSDK.Destroy(targetParticle, true)
		targetParticle = undefined
	} else {
		ParticlesSDK.SetControlPoint(targetParticle, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(targetParticle, 6, new Vector3(1))
		ParticlesSDK.SetControlPoint(targetParticle, 7, MouseTarget.Position)
	}
}

export function DrawDeleteTempAllVars() {
	Sleep.FullReset()
	targetParticle = undefined
}