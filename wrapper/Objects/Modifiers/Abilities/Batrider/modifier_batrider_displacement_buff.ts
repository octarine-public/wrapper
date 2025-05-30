import { ImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { AbilityData } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_batrider_displacement_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(): string {
		return ImagePath + "/hud/facets/icons/speed_png.vtex_c"
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("movement_speed_pct")
		this.cachedSpellAmplify = this.GetSpecialValue("spell_amplification")
	}
	protected GetSpecialValue(
		specialName: string,
		abilityName: string = "batrider_stoked",
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const data = AbilityData.GetAbilityByName(abilityName)
		return data?.GetSpecialValue(specialName, level) ?? 0
	}
}
