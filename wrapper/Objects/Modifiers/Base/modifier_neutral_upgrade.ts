import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { GameState } from "../../../Utils/GameState"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_neutral_upgrade extends Modifier {
	private cachedArmor = 0
	private cachedDamage = 0
	private cachedAttackSpeed = 0
	private cachedIncreaseTime = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.getIncreaseByTime(this.cachedDamage), false]
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.getIncreaseByTime(this.cachedArmor), false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.getIncreaseByTime(this.cachedAttackSpeed), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "neutral_upgrade"
		this.cachedArmor = this.GetSpecialValue("increase_armor", name)
		this.cachedDamage = this.GetSpecialValue("increase_damage", name)
		this.cachedAttackSpeed = this.GetSpecialValue("increase_aspd", name)
		this.cachedIncreaseTime = this.GetSpecialValue("increase_time", name)
	}

	private getIncreaseByTime(value: number): number {
		return Math.floor(GameState.RawGameTime / this.cachedIncreaseTime) * value
	}
}
