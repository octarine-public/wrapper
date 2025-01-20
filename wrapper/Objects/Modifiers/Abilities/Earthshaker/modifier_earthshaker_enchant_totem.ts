import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { earthshaker_enchant_totem } from "../../../../Objects/Abilities/Earthshaker/earthshaker_enchant_totem"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earthshaker_enchant_totem extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedRange = 0
	private cachedAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return true
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.abilityChanged(false)
		return true
	}

	protected AddModifier(): boolean {
		if (!super.AddModifier()) {
			return false
		}
		this.abilityChanged(true)
		return true
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [this.cachedAttackDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "earthshaker_enchant_totem"
		this.cachedRange = this.GetSpecialValue("bonus_attack_range", name)
		this.cachedAttackDamage = this.GetSpecialValue("totem_damage_percentage", name)
	}

	private abilityChanged(state: boolean): void {
		if (this.Ability instanceof earthshaker_enchant_totem) {
			this.Ability.HasModifier = state
		}
	}
}
