import { MoveSpeedData } from "../../../Data/GameData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_fountain_aura_buff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])

	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [(this.Parent?.IsCourier ?? false) ? MoveSpeedData.Max : 0, false]
	}
}
