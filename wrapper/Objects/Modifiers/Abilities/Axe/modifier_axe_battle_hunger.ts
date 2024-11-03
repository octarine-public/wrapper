import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_battle_hunger extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedSpeedValue = 0

	public PostDataUpdate(): void {
		const owner = this.Parent
		const caster = this.Caster
		if (owner === undefined || caster === undefined) {
			this.cachedSpeed = 0
			return
		}
		const isFace = owner.GetAngle(caster.Position) <= Math.PI / 2
		this.cachedSpeed = isFace || this.IsMagicImmune() ? 0 : this.cachedSpeedValue
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeedValue = this.GetSpecialValue("slow", "axe_battle_hunger")
	}
}
