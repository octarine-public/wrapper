import { MoveSpeedData } from "../../../Data/GameData"
import { AbilityImagePath } from "../../../Data/PathData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_fountain_aura_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])
	public GetTexturePath(): string {
		return AbilityImagePath + "/fountain_heal_png.vtex_c"
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [(this.Parent?.IsCourier ?? false) ? MoveSpeedData.Max : 0, false]
	}
}
