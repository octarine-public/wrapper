import { WrapperClassModifier } from "../../../Decorators"
import { ModifierManager } from "../../../Managers/ModifierManager"
import { GameState } from "../../../Utils/GameState"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_wraith_band extends Modifier {
	public readonly BonusArmorStack = true
	public readonly BonusAttackSpeedStack = true

	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackSpeed = 0
		this.isEmited = false
		return true
	}

	public OnIntervalThink(): void {
		this.SetBonusArmor()
		this.SetBonusAttackSpeed()
	}

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false) {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetBonusAttackSpeed(specialName = "bonus_attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected GetSpecialValue(specialName: string, level = this.AbilityLevel): number {
		const time = GameState.RawGameTime / 60
		const clockTime = super.GetSpecialValue("clock_time", level)
		return time >= clockTime
			? super.GetSpecialValue(specialName, level + 1)
			: super.GetSpecialValue(specialName, level)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
