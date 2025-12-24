import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_earth_spell_immunity extends Modifier {
	private cachedMres = 0
	private slowResistance = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
			this.GetAbsoluteNoDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])
	protected GetAbsoluteNoDamagePure(): [number, boolean] {
		return [1, false]
	}
	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.slowResistance, false]
	}
	protected GetMagicalResistanceBonus(params?: IModifierParams): [number, boolean] {
		const ignoreSpellImmune = params?.IgnoreMagicResist ?? false
		return !ignoreSpellImmune ? [this.cachedMres, false] : [0, false]
	}
	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "brewmaster_earth_spell_immunity"
		this.cachedMres = this.GetSpecialValue("magic_resist", name)
		this.slowResistance = this.GetSpecialValue("slow_resist", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resist", name)
	}
}
