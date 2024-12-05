import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { HeightMap } from "../../../Native/WASM"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_hurricane_pike_range extends Modifier {
	private cachedRange = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
			this.GetMaxAttackRange.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetMaxAttackRange(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedRange : 0, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = HeightMap?.MapSize.LengthSqr ?? Number.MAX_SAFE_INTEGER
		this.cachedAttackSpeed = this.GetSpecialValue(
			"bonus_attack_speed",
			"item_hurricane_pike"
		)
	}
}
