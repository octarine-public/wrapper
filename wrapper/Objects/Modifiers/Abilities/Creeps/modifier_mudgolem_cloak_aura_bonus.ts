import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mudgolem_cloak_aura_bonus extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMresHero = 0
	private cachedMresCreep = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || this.IsPassiveDisabled(this.Caster)) {
			return [0, false]
		}
		if (owner.IsHero) {
			return [this.cachedMresHero, false]
		}
		if (owner.IsCreep) {
			return [this.cachedMresCreep, false]
		}
		return [0, false]
	}
	protected UpdateSpecialValues() {
		const name = "mudgolem_cloak_aura"
		this.cachedMresHero = this.GetSpecialValue("bonus_magical_armor", name)
		this.cachedMresCreep = this.GetSpecialValue("bonus_magical_armor_creeps", name)
	}
}
