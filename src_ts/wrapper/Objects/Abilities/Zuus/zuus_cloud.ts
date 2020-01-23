import Ability from "../../Base/Ability"

export default class zuus_cloud extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Zuus_Cloud>

	public get CastRange(): number {
		return Number.MAX_SAFE_INTEGER
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("cloud_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("zuus_cloud", zuus_cloud)
