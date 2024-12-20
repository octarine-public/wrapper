import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_krill_eater extends Modifier {
	private cachedRange = 0
	private cachedRangePerLevel = 0

	private cachedRadius = 0
	private cachedRadiusPerLevel = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	public get BonusAOERadius(): number {
		return this.getBonusByLevel(this.cachedRadius, this.cachedRadiusPerLevel)
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.getBonusByLevel(this.cachedRange, this.cachedRangePerLevel), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "tidehunter_krill_eater"
		this.cachedRange = this.GetSpecialValue("attack_range_base", name)
		this.cachedRangePerLevel = this.GetSpecialValue("attack_range_per_level", name)
		this.cachedRadius = this.GetSpecialValue("anchor_smash_radius_base", name)
		this.cachedRadiusPerLevel = this.GetSpecialValue(
			"anchor_smash_radius_per_level",
			name
		)
	}

	private getBonusByLevel(value: number, perLevel: number): number {
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		if (owner.Level > 1) {
			value += perLevel * owner.Level
		}
		return value
	}
}
