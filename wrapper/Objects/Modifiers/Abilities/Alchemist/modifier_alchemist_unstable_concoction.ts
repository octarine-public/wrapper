import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_unstable_concoction extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedMaxDamage = 0
	private cachedMaxExplosion = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public get RemainingDamage() {
		const time = this.ElapsedTime / this.cachedMaxExplosion
		return this.cachedMaxDamage * time
	}

	public IsBuff(): this is IBuff {
		return true
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "alchemist_unstable_concoction"
		this.cachedSpeed = this.GetSpecialValue("move_speed", name)
		this.cachedMaxDamage = this.GetSpecialValue("max_damage", name)
		this.cachedMaxExplosion = this.GetSpecialValue("brew_explosion", name)
	}
}
