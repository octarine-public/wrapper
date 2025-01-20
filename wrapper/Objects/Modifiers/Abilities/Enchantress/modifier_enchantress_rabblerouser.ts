import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_enchantress_rabblerouser extends Modifier {
	public readonly IsHidden = false
	public readonly IsGlobally = true

	private cachedOutBaseDamage = 0
	private cachedOutDamagePerLvl = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetOutgoingDamagePercentageIllusion.bind(this)
		]
	])

	private GetOutgoingDamagePercentageIllusion(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled(this.Caster)) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsHero) {
			return [0, false]
		}
		if (target === this.Parent || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		const damagePerLvl = this.cachedOutDamagePerLvl * (this.Caster?.Level ?? 0)
		return [this.cachedOutBaseDamage + damagePerLvl, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "enchantress_rabblerouser"
		this.cachedOutBaseDamage = this.GetSpecialValue("base_damage_amp", name)
		this.cachedOutDamagePerLvl = this.GetSpecialValue("damage_amp_per_level", name)
	}
}
