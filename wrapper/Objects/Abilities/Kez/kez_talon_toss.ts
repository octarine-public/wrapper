import { WrapperClass } from "../../../Decorators"
import { modifier_kez_shodo_sai_mark } from "../../../Objects/Modifiers/Abilities/Kez/modifier_kez_shodo_sai_mark"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("kez_talon_toss")
export class kez_talon_toss extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return super.GetRawDamage(target) * this.multiplyDamageByMark(target)
	}

	private multiplyDamageByMark(target: Unit): number {
		if (target.IsBuilding) {
			return 1
		}
		const modifier = target.GetBuffByClass(modifier_kez_shodo_sai_mark)
		return modifier?.CritDamageBonus ?? 1
	}
}
