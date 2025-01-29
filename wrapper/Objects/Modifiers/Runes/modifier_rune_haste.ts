import { MoveSpeedData } from "../../../Data/GameData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_haste extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])
	public get ForceVisible() {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [MoveSpeedData.Max, false] // harcoded: 550
	}
}
