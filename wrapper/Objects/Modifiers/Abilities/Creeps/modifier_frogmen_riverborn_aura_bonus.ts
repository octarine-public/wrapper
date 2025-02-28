import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_frogmen_riverborn_aura_bonus extends Modifier {
	private cachedSpeed = 0
	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetDamageOutgoingPercentage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex(params.SourceIndex)
		if (target === undefined || target === this.Parent) {
			return [0, false]
		}
		if (!target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.cachedOutgoingDamage, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsPassiveDisabled(this.Caster)]
	}
	protected UpdateSpecialValues(): void {
		const name = "frogmen_riverborn_aura"
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", name)
		this.cachedOutgoingDamage = this.GetSpecialValue("bonus_outgoing_damage", name)
	}
}
