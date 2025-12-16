import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_silver_edge_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	private cachedSpeedMax = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT,
			this.GetMoveSpeedLimit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_MAX_OVERRIDE,
			this.GetMoveSpeedMaxOverride.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedLimit(): [number, boolean] {
		return [this.cachedSpeedMax, false]
	}
	protected GetMoveSpeedMaxOverride(): [number, boolean] {
		return [this.cachedSpeedMax, false]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeedMax = this.GetSpecialValue(
			"max_movement_speed",
			"item_silver_edge"
		)
	}
}
