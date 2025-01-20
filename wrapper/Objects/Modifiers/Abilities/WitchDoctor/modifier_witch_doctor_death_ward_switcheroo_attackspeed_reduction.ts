import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_witch_doctor_death_ward_switcheroo_attackspeed_reduction
	extends Modifier
	implements IBuff
{
	public readonly BuffModifierName = this.Name

	private cachedDuration = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public get Duration() {
		return this.cachedDuration || super.Duration
	}
	public get ForceVisible() {
		return true
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues() {
		const name = "witch_doctor_voodoo_switcheroo"
		this.cachedDuration = this.GetSpecialValue("duration", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_reduction", name)
	}
}
