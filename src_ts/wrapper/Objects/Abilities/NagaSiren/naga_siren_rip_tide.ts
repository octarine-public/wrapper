import Ability from "../../Base/Ability"

export default class naga_siren_rip_tide extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_NagaSiren_RipTide>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("naga_siren_rip_tide", naga_siren_rip_tide)
