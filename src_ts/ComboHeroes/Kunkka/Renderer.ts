import { Game, ParticlesSDK, Vector3, LocalPlayer } from "wrapper/Imports"
import { Base } from "./Extends/Helper"
import { State } from "./Menu"
import { MouseTarget, Owner } from "./Listeners"
import { InitDrawStaker } from "./Module/AutoStacker"
let targetParticle: number = 0
export function Draw() {
	if (LocalPlayer === undefined) {
		return
	}
	if (!Base.IsRestrictions(State) || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator) {
		return
	}
	if (Owner === undefined || !Owner.IsAlive) {
		return
	}
	if (targetParticle === undefined && MouseTarget !== undefined) {
		targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, MouseTarget)
	}
	if (targetParticle !== undefined) {
		if (MouseTarget === undefined) {
			ParticlesSDK.Destroy(targetParticle, true)
			targetParticle = undefined
		} else {
			ParticlesSDK.SetControlPoint(targetParticle, 2, Owner.Position)
			ParticlesSDK.SetControlPoint(targetParticle, 6, new Vector3(1))
			ParticlesSDK.SetControlPoint(targetParticle, 7, MouseTarget.Position)
		}
	}
	InitDrawStaker()
}
