import { Vector3 } from "../../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("rubick_telekinesis_land")
export class rubick_telekinesis_land extends Ability {
	@NetworkedBasicField("m_vStartLocation")
	public readonly StartLocation = new Vector3()
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
