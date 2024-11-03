import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { kez_shodo_sai } from "../../../Abilities/Kez/kez_shodo_sai"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_sai extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	private cachedSpeed = 0

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
		// Valve replace ability if there is a shard
		if (!(this.Ability instanceof kez_shodo_sai)) {
			return
		}
		this.cachedSpeed = this.GetSpecialValue(
			"shard_base_movement_speed",
			this.Ability.Name
		)
	}
}
