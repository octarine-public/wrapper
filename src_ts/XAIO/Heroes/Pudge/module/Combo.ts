import { Unit } from "wrapper/Imports"
import { ComboKey } from "../Menu"
import {
	XAIOInput,
	//UnitsOrbWalker,
	XAIOPrediction,
	XAIOHitChance,
	XAIOCollisionTypes,
	XAIOSkillshotType,
	XAIOutput,
} from "../../../Helper/bootstrap"

let xAIOPrediction = new XAIOPrediction()

let hit: XAIOHitChance = XAIOHitChance.Impossible

function ShouldCastHook(Input: XAIOutput) {
	if (Input.HitChance! === XAIOHitChance.Impossible) {
		hit = XAIOHitChance.Impossible
	}
	return Input.HitChance! === XAIOHitChance.Impossible
}
export function InitCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined || !unit.IsVisible || !ComboKey.is_pressed) {
		hit = XAIOHitChance.Impossible
		return
	}
	let abil = unit.GetAbilityByName("pudge_meat_hook")
	if (abil === undefined)
		return

	if (abil.CanBeCasted()) {
		let Input = new XAIOInput(
			enemy, unit,
			abil.CastRange,
			abil.CastPoint,
			enemy.HullRadius,
			abil.GetSpecialValue("hook_width"),
			XAIOCollisionTypes.AllUnits,
			0, /* Addrange */
			true, /* RequiresToTurn */
			XAIOSkillshotType.Line,
			abil.GetSpecialValue("hook_speed"),
			false /* use blink */
		)

		let predictionOutput = xAIOPrediction.GetPrediction(Input)

		if (enemy.Distance(unit) < 300)
			return

		hit = predictionOutput.HitChance!
		if (abil.IsInAbilityPhase && ShouldCastHook(predictionOutput)) {
			predictionOutput.HitChance = XAIOHitChance.Impossible
			unit.OrderStop()
			return
		}

		unit.CastPosition(abil, predictionOutput.CastPosition!)
	}

	// if (!UnitsOrbWalker.get(unit)?.Execute(enemy))
	// 	return

}


EventsSDK.on("Draw", () => {
	if (LocalPlayer === undefined || LocalPlayer.Hero === undefined || LocalPlayer.Hero.Name !== "npc_dota_hero_pudge")
		return
	let position_unit = RendererSDK.WorldToScreen(LocalPlayer.Hero.Position)
	if (position_unit === undefined)
		return
	let hitChance = "Hit Chance: " + hit.toString()
	RendererSDK.Text(hitChance, position_unit.SubtractScalarX(75).SubtractScalarY(-50))
})