import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_arena_kill_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedBonusDamage = 0
	private cachedBonusDmgAlly = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		let damage = this.cachedBonusDamage
		if (caster !== owner) {
			damage = damage * (1 - this.cachedBonusDmgAlly / 100)
		}
		return [damage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "mars_arena_of_blood"
		this.cachedBonusDamage = this.GetSpecialValue("arena_kill_buff_damage_pct", name)
		this.cachedBonusDmgAlly = this.GetSpecialValue("allied_reduction_pct", name)
	}
}
