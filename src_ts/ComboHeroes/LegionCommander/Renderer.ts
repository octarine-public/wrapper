import { Game, GameSleeper, ParticlesSDK, Vector3 } from "wrapper/Imports"
import InitAbilities from "./Extends/Abilities"
import { Base } from "./Extends/Helper"
import InitItems from "./Extends/Items"
import { MouseTarget, Owner } from "./Listeners"

import {
	BlinkRadiusItem, BlinkRadiusItemColor,
	DrawTargetItem, DuelRadiusItem,
	DuelRadiusItemColor,
	OverwhelmingOddsRadiusColor,
	OverwhelmingOddsRadiusItem,
	PressTheAttackRadiusItem,
	PressTheAttackRadiusItemColor,
	State,
} from "./Menu"

let Duel: number,
	Blink: number,
	targetParticle: number,
	OverwhelmingPartID: number,
	PressTheAttackPartID: number

let Sleep = new GameSleeper

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

function UpdateBLink() {
	if(Sleep.Sleeping("Blink"))
		return false
	let Items = new InitItems(Owner)
	if (Blink === undefined) {
		if (Duel !== undefined) {
			ParticlesSDK.Destroy(Duel, true)
		}
		Blink = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}

	if (Items.Blink !== undefined) {
		let color = BlinkRadiusItemColor.Color
		ParticlesSDK.SetControlPoint(Blink, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(Blink, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(Blink, 3, new Vector3(Items.ItemCastRange(Items.Blink, "blink_range")))
		ParticlesSDK.SetControlPoint(Blink, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "Blink")
	}
	else DeleteBlink()
}
function UpdateOverwhelmingOdds() {
	if (Sleep.Sleeping("UpdateOverwhelmingOdds"))
		return false
	let Abilities = new InitAbilities(Owner)
	if (OverwhelmingPartID === undefined) {
		if (OverwhelmingPartID !== undefined) {
			ParticlesSDK.Destroy(OverwhelmingPartID, true)
		}
		OverwhelmingPartID = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}

	if (Abilities.Overwhelming !== undefined && Abilities.Overwhelming.Level !== 0) {
		let color = OverwhelmingOddsRadiusColor.Color
		ParticlesSDK.SetControlPoint(OverwhelmingPartID, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(OverwhelmingPartID, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(OverwhelmingPartID, 3, new Vector3(Abilities.Overwhelming.CastRange))
		ParticlesSDK.SetControlPoint(OverwhelmingPartID, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "UpdateOverwhelmingOdds")
	}
	else DeleteOverwhelmingOdds()
}
function UpdatePressTheAttack() {
	if (Sleep.Sleeping("UpdatePressTheAttack"))
		return false
	let Abilities = new InitAbilities(Owner)
	if (PressTheAttackPartID === undefined) {
		if (PressTheAttackPartID !== undefined) {
			ParticlesSDK.Destroy(PressTheAttackPartID, true)
		}
		PressTheAttackPartID = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}

	if (Abilities.PressTheAttack !== undefined && Abilities.PressTheAttack.Level !== 0) {
		let color = PressTheAttackRadiusItemColor.Color
		ParticlesSDK.SetControlPoint(PressTheAttackPartID, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(PressTheAttackPartID, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(PressTheAttackPartID, 3, new Vector3(Abilities.PressTheAttack.CastRange))
		ParticlesSDK.SetControlPoint(PressTheAttackPartID, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "UpdatePressTheAttack")
	} else DeletePressTheAttack()
}
function UpdateDuel() {
	if (Sleep.Sleeping("UpdateDuel"))
		return false
	let Abilities = new InitAbilities(Owner)
	if (Duel === undefined) {
		if (Duel !== undefined) {
			ParticlesSDK.Destroy(Duel, true)
		}
		Duel = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Owner)
	}

	if (Abilities.Duel !== undefined && Abilities.Duel.Level !== 0) {
		let color = DuelRadiusItemColor.Color
		ParticlesSDK.SetControlPoint(Duel, 0, Owner.Position)
		ParticlesSDK.SetControlPoint(Duel, 2, Owner.Position)
		ParticlesSDK.SetControlPoint(Duel, 3, new Vector3(Abilities.Duel.CastRange))
		ParticlesSDK.SetControlPoint(Duel, 4, new Vector3(color.r, color.g, color.b))
		Sleep.Sleep(0, "UpdateDuel")
	}
	else DeleteOverwhelmingOdds()
}
export function DrawDeleteTempAllVars() {
	Sleep.FullReset()
	Duel = undefined
	Blink = undefined
	targetParticle = undefined
	OverwhelmingPartID = undefined
	PressTheAttackPartID = undefined
}
export function Draw() {

	if (!Base.IsRestrictions(State) || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		return false
	}

	// temp solution
	// Overwhelming Odds
	OverwhelmingOddsRadiusItem.value
		? UpdateOverwhelmingOdds()
		: DeleteOverwhelmingOdds()

	// temp solution
	// Press The Attack
	PressTheAttackRadiusItem.value
		? UpdatePressTheAttack()
		: DeletePressTheAttack()

	// temp solution
	// Duel
	DuelRadiusItem.value
		? UpdateDuel()
		: DeleteDuel()

	// Blink
	// temp solution
	BlinkRadiusItem.value
		? UpdateBLink()
		: DeleteBlink()

	// Target
	if (DrawTargetItem.value) {
		if (targetParticle === undefined && MouseTarget !== undefined) {
			targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, MouseTarget)
		}
		if (targetParticle !== undefined) {
			DrawTarget()
		}
	}
}
function DeleteOverwhelmingOdds() {
	if (OverwhelmingPartID !== undefined) {
		ParticlesSDK.Destroy(OverwhelmingPartID, true)
		OverwhelmingPartID = undefined
	}
}
function DeletePressTheAttack() {
	if (PressTheAttackPartID !== undefined) {
		ParticlesSDK.Destroy(PressTheAttackPartID, true)
		PressTheAttackPartID = undefined
	}
}
function DeleteDuel() {
	if (Duel !== undefined) {
		ParticlesSDK.Destroy(Duel, true)
		Duel = undefined
	}
}
function DeleteBlink() {
	if (Blink !== undefined) {
		ParticlesSDK.Destroy(Blink, true)
		Blink = undefined
	}
}