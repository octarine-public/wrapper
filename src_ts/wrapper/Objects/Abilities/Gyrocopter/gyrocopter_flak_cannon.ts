import Ability from "../../Base/Ability"

export default class gyrocopter_flak_cannon extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Gyrocopter_Flak_Cannon>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("gyrocopter_flak_cannon", gyrocopter_flak_cannon)
