import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { AbilityData } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_oracle_false_promise extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0
	private cachedBATTime = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST,
			this.GetBaseAttackTimeConstantAdjust.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetBaseAttackTimeConstantAdjust(): [number, boolean] {
		return [this.cachedBATTime, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("bonus_armor")
		this.cachedBATTime = this.GetSpecialValue("shard_bat_bonus")
		this.cachedSpellAmplify = this.GetSpecialValue("shard_spell_amp_bonus")
	}

	// override because shard_bat_bonus
	// not current from "RequiresShard" expected "RequiresScepter"
	protected GetSpecialValue(
		specialName: string,
		abilityName = "oracle_false_promise",
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	) {
		if (specialName === "bonus_armor") {
			return super.GetSpecialValue(specialName, abilityName, level)
		}
		const caster = this.Caster,
			ability = this.Ability
		if (caster === undefined || !caster.HasScepter) {
			return 0
		}
		if (ability === undefined) {
			const abilData = AbilityData.GetAbilityByName(abilityName)
			return abilData?.GetSpecialValue(specialName, level) ?? 0
		}
		this.CachedAbilityName = abilityName
		return ability.AbilityData.GetSpecialValue(specialName, level)
	}
}
