import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_willow_shadow_realm_aura_debuff
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamage = 0
	private cachedMaxDamageTime = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	private get remainingDamage(): number {
		const multiplier = this.ElapsedTime / this.cachedMaxDamageTime
		return Math.min(this.cachedDamage * multiplier, this.cachedDamage)
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined || this.cachedDamage === 0) {
			return [0, false]
		}
		if (params.SourceIndex !== caster.Index) {
			return [0, false]
		}
		return params.SourceIndex === caster.Index
			? [this.remainingDamage, false]
			: [0, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "dark_willow_shadow_realm"
		this.cachedDamage = this.GetSpecialValue("aura_damage_pct", name)
		this.cachedMaxDamageTime = this.GetSpecialValue("max_damage_duration", name)
	}
}
