import Ability from "../../Base/Ability"

export default class ursa_enrage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Ursa_Enrage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ursa_enrage", ursa_enrage)
