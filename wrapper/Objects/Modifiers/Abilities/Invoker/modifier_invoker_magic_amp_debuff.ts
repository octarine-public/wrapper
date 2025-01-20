import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_exort } from "../../../../Objects/Abilities/Invoker/invoker_exort"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_magic_amp_debuff extends Modifier {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_TARGET,
			this.GetSpellAmplifyPercentageTarget.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetSpellAmplifyPercentageTarget(): [number, boolean] {
		return [this.cachedSpellAmplify, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues() {
		const amplification = this.GetSpecialValue("magic_amp", "invoker_exort")
		this.updateByInstanceActive(amplification)
	}
	private updateByInstanceActive(value: number): void {
		const caster = this.Caster,
			ability = this.Ability as Nullable<invoker_exort>
		if (caster === undefined || ability === undefined || this.IsMagicImmune()) {
			this.cachedSpellAmplify = 0
			return
		}
		let activeCount = 0
		for (let i = caster.Buffs.length - 1; i > -1; i--) {
			const modifier = caster.Buffs[i]
			if (modifier.Name === "modifier_invoker_exort_instance") {
				activeCount++
			}
		}
		this.cachedSpellAmplify = value * activeCount
	}
}
