import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_battle_trance_ally extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedAttackSpeed = 0
	private cachedSharePctAS = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed * (this.cachedSharePctAS / 100), false]
	}
	protected UpdateSpecialValues(): void {
		const name = "troll_warlord_battle_trance"
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
		this.cachedSharePctAS = this.GetSpecialValue("attack_speed_share_percent", name)
	}
}
