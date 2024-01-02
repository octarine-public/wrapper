import { MoveSpeedData } from "../../../../Data/GameData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_weaver_shukuchi extends Modifier {
	public readonly BonusMoveSpeed = MoveSpeedData.Max
}
