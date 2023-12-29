import { SpeedData } from "../../../../Data/GameData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_centaur_stampede extends Modifier {
	public readonly BonusMoveSpeed = SpeedData.Max
}
