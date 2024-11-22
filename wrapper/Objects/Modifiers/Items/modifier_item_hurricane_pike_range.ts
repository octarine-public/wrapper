import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { HeightMap } from "../../../Native/WASM"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_hurricane_pike_range extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
			this.GetMaxAttackRange.bind(this)
		]
	])

	private cachedRange = 0

	protected GetMaxAttackRange(): [number, boolean] {
		return [(this.Parent?.IsRanged ?? false) ? this.cachedRange : 0, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange =
			HeightMap === undefined
				? Number.MAX_SAFE_INTEGER
				: HeightMap.MapSize.x ** 2 + HeightMap.MapSize.y ** 2
	}
}
