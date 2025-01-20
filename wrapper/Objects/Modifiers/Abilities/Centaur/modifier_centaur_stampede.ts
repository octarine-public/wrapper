import { MoveSpeedData } from "../../../../Data/GameData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_centaur_stampede extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly IsGlobally = true
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return true
	}

	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [MoveSpeedData.Max, false]
	}
}
