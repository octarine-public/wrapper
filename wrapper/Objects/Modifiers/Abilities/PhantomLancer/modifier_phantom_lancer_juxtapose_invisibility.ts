import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { AbilityData } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_phantom_lancer_juxtapose_invisibility
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	// override because invis_movespeed
	// not current from "RequiresScepter" expected "RequiresShard"
	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	) {
		const owner = this.Parent,
			ability = this.Ability
		if (owner === undefined || !owner.HasShard) {
			return 0
		}
		if (ability === undefined) {
			const abilData = AbilityData.GetAbilityByName(abilityName)
			return abilData?.GetSpecialValue(specialName, level) ?? 0
		}
		this.CachedAbilityName = abilityName
		return ability.AbilityData.GetSpecialValue(specialName, level)
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"invis_movespeed",
			"phantom_lancer_juxtapose"
		)
	}
}
