import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../../Objects/Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_mana_shield extends Modifier implements IShield {
	public readonly ShieldModifierName = this.Name

	private cachedAbsorption = 0
	private cachedDamagePerMana = 0
	private cachedIllusionReduction = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsShield(): this is IShield {
		return true
	}
	protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent,
			mana = owner?.Mana ?? 0
		if (owner === undefined || mana <= 0) {
			return [0, false]
		}
		const dpm = owner.IsIllusion
			? this.cachedDamagePerMana * (1 - this.cachedIllusionReduction / 100)
			: this.cachedDamagePerMana
		if (dpm <= 0) {
			return [0, false]
		}
		const rawDamage = params?.RawDamage ?? 0
		if (rawDamage <= 0) {
			// no raw damage info — assume mana sufficient, return full absorption
			return [-this.cachedAbsorption, false]
		}
		const wantAbsorb = (rawDamage * this.cachedAbsorption) / 100
		const manaNeeded = wantAbsorb / dpm
		const actualAbsorb = manaNeeded <= mana ? wantAbsorb : mana * dpm
		return [-(actualAbsorb / rawDamage) * 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "medusa_mana_shield",
			lvl = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		this.cachedAbsorption = this.GetSpecialValue("absorption_pct", name)
		this.cachedIllusionReduction = this.GetSpecialValue("illusion_percentage", name)
		this.cachedDamagePerMana = this.GetSpecialValue("damage_per_mana", name, lvl)
	}
}
