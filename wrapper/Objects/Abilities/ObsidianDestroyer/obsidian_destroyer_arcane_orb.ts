import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("obsidian_destroyer_arcane_orb")
export class obsidian_destroyer_arcane_orb extends Ability {
	public GetRawDamage(_target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const manaPool = this.GetSpecialValue("mana_pool_damage_pct")
		return ((owner.Mana - this.ManaCost) * manaPool) / 100
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		if (this.IsAutoCastEnabled && this.IsReady) {
			return owner.GetAttackDamage(target)
		}
		return super.GetDamage(target) + owner.GetAttackDamage(target)
	}
}
