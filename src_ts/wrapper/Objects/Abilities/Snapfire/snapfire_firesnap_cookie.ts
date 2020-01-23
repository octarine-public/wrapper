import Ability from "../../Base/Ability"

export default class snapfire_firesnap_cookie extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Snapfire_FiresnapCookie>

	public get AOERadius(): number {
		return this.GetSpecialValue("impact_radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("snapfire_firesnap_cookie", snapfire_firesnap_cookie)
