import { GetSpellTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { slark_barracuda } from "../../../../Objects/Abilities/Slark/slark_barracuda"
import { slark_shadow_dance } from "../../../../Objects/Abilities/Slark/slark_shadow_dance"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { AbilityData } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_slark_shadow_dance extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	private cachedDuration = 0
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public get Duration(): number {
		return this.cachedDuration || super.Duration
	}
	public GetTexturePath(): string {
		return this.Ability instanceof slark_barracuda
			? GetSpellTexture("slark_depth_shroud")
			: super.GetTexturePath()
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public PostDataUpdate(): void {
		const caster = this.Caster
		if (caster === undefined) {
			this.cachedSpeed = 0
			this.cachedAttackSpeed = 0
			return
		}
		this.updateMoveSpeed(caster)
		this.cachedAttackSpeed = this.getSpeedByAbilityName(
			"special_bonus_unique_slark_7",
			"value",
			caster
		)
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof slark_barracuda) {
			this.cachedDuration = this.GetSpecialValue("duration", "slark_depth_shroud")
		}
		if (this.Ability instanceof slark_shadow_dance) {
			this.cachedDuration = this.GetSpecialValue("duration", this.Ability.Name)
		}
	}
	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		if (abilityName !== "slark_depth_shroud") {
			return super.GetSpecialValue(specialName, abilityName, level)
		}
		const data = AbilityData.GetAbilityByName(abilityName)
		if (data === undefined) {
			return 0
		}
		this.CachedAbilityName = this.Ability?.Name ?? abilityName
		return data?.GetSpecialValue(specialName, level) ?? 0
	}
	private getSpeedByAbilityName(abilName: string, specialName: string, owner: Unit) {
		const abil = owner.GetAbilityByName(abilName)
		if (abil === undefined || abil.Level === 0) {
			return 0
		}
		return abil.GetSpecialValue(specialName)
	}
	private updateMoveSpeed(caster: Unit) {
		const modifier = caster.GetBuffByName("modifier_slark_shadow_dance_passive_regen")
		if (modifier !== undefined || caster.IsPassiveDisabled) {
			this.cachedSpeed = 0
			return
		}
		this.cachedSpeed = this.getSpeedByAbilityName(
			"slark_barracuda",
			"bonus_movement_speed",
			caster
		)
	}
}
