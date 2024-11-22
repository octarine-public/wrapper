import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { kez_shodo_sai } from "../../../Abilities/Kez/kez_shodo_sai"
import { kez_switch_weapons } from "../../../Abilities/Kez/kez_switch_weapons"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_sai extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE,
			this.GetAttackBaseOverride.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedRange = 0

	protected GetAttackBaseOverride(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent,
			ability = this.Ability
		if (owner === undefined || ability?.IsHidden) {
			return [0, false]
		}
		let value = this.NetworkMovementSpeed
		if (owner.HasShard) {
			value += this.cachedSpeed
		}
		return [value, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof kez_switch_weapons) {
			this.cachedRange = this.GetSpecialValue("sai_attack_range", this.Ability.Name)
		}
		// Valve replace ability if there is a shard
		if (this.Ability instanceof kez_shodo_sai) {
			this.cachedSpeed = this.GetSpecialValue(
				"shard_base_movement_speed",
				this.Ability.Name
			)
		}
	}
}
