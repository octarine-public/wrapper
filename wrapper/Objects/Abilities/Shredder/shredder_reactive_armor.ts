import { WrapperClass } from "../../../Decorators"
import { modifier_shredder_reactive_armor_bomb } from "../../../Objects/Modifiers/Abilities/Shredder/modifier_shredder_reactive_armor_bomb"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("shredder_reactive_armor")
export class shredder_reactive_armor extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetRawDamage(_target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const modifier = owner.GetBuffByClass(modifier_shredder_reactive_armor_bomb)
		return modifier?.CurrentShieldDamage ?? 0
	}
}
