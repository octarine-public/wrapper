import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameActivity } from "../../../../Enums/GameActivity"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { GameState } from "../../../../Utils/GameState"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_legion_commander_moment_of_courage extends Modifier {
	public GestureLastUpdate = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return GameState.RawGameTime >= this.GestureLastUpdate
			? [0, false]
			: [1000, this.IsPassiveDisabled()] // 1000 hardcoded
	}
}

EventsSDK.on("UnitAddGesture", (npc, activity) => {
	if (!(npc instanceof Unit) || activity !== GameActivity.ACT_DOTA_ATTACK) {
		return
	}
	const modifier = npc.GetBuffByClass(modifier_legion_commander_moment_of_courage)
	if (modifier !== undefined) {
		modifier.GestureLastUpdate = GameState.RawGameTime + npc.AttackPoint
	}
})
