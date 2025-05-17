import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("clinkz_burning_barrage")
export class clinkz_burning_barrage extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("damage_pct")
		const attackDamage = owner.GetRawAttackDamage(target)
		return (attackDamage * multiplier) / 100
	}

	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target)
		)
	}
}
