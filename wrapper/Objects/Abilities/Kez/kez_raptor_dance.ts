import { WrapperClass } from "../../../Decorators"
import { modifier_kez_shodo_sai_mark } from "../../../Objects/Modifiers/Abilities/Kez/modifier_kez_shodo_sai_mark"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("kez_raptor_dance")
export class kez_raptor_dance extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const baseDamage = super.GetRawDamage(target),
			multiplier = this.GetSpecialValue("max_health_damage_pct"),
			totalRawDamage = baseDamage + (target.MaxHP * multiplier) / 100
		return totalRawDamage * this.multiplyDamageByMark(target)
	}
	private multiplyDamageByMark(target: Unit): number {
		if (target.IsBuilding) {
			return 1
		}
		const modifier = target.GetBuffByClass(modifier_kez_shodo_sai_mark)
		return (modifier?.MulCritDamageBonus(target) ?? 100) / 100
	}
}
