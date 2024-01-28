import { MoveSpeedData } from "../../../Data/GameData"
import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_haste extends Modifier {
	public readonly BonusMoveSpeed = MoveSpeedData.Max

	public GetTexturePath(small = false) {
		return GetRuneTexture("haste", small)
	}
}
