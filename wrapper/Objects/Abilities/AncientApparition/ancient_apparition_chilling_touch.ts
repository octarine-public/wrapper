import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("ancient_apparition_chilling_touch")
export class ancient_apparition_chilling_touch extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const baseDamage = super.GetDamage(target)
		if (baseDamage === 0) {
			return 0
		}
		if (this.IsAutoCastEnabled && this.IsReady) {
			return owner.GetAttackDamage(target)
		}
		return baseDamage + owner.GetAttackDamage(target)
	}
}
