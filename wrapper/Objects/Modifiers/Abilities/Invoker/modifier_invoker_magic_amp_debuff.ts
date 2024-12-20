import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_exort } from "../../../../Objects/Abilities/Invoker/invoker_exort"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_magic_amp_debuff extends Modifier {
	private cachedSpellAmplify = 0
	private cachedSpellAmplifyValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_TARGET,
			this.GetSpellAmplifyPercentageTarget.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const caster = this.Caster,
			ability = this.Ability as Nullable<invoker_exort>
		if (caster === undefined || ability === undefined || this.IsMagicImmune()) {
			this.cachedSpellAmplify = 0
			return
		}
		let activeCount = 0
		for (let i = caster.Buffs.length - 1; i > -1; i--) {
			const modifier = caster.Buffs[i]
			if (modifier.Name !== "modifier_invoker_exort_instance") {
				continue
			}
			activeCount++
		}
		this.cachedSpellAmplify = this.cachedSpellAmplifyValue * activeCount
	}

	protected GetSpellAmplifyPercentageTarget(): [number, boolean] {
		return [this.cachedSpellAmplify, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		const caster = this.Caster
		if (caster === undefined) {
			this.cachedSpellAmplifyValue = 0
			return
		}
		this.cachedSpellAmplifyValue = this.GetSpecialValue("magic_amp", "invoker_exort")
		const multiplier = caster.GetAbilityByName("special_bonus_unique_invoker_13")
		if ((multiplier?.Level ?? 0) !== 0) {
			this.cachedSpellAmplifyValue *= 2
		}
	}
}
