import Ability from "../../Base/Ability"

export default class arc_warden_flux extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ArcWarden_Flux>

	public get AOERadius(): number {
		return this.GetSpecialValue("search_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("arc_warden_flux", arc_warden_flux)
