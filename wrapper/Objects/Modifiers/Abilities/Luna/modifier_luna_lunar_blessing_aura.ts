import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_lunar_blessing_aura extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly IsGlobally = true
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedDamageSelf = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public get StackCount(): number {
		return this.getDamage() >> 0 || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.getDamage(), this.IsPassiveDisabled(this.Caster)]
	}
	protected UpdateSpecialValues(): void {
		const name = "luna_lunar_blessing"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedDamageSelf = this.GetSpecialValue("self_bonus_damage", name)
	}
	private getDamage(): number {
		const caster = this.Caster
		if (caster === undefined) {
			return 0
		}
		let damage = this.cachedDamageSelf * caster.Level
		if (caster !== this.Parent) {
			damage = this.cachedDamage * caster.Level
		}
		return damage
	}
}
