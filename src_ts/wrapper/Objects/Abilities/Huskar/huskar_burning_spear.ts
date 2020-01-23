import Ability from "../../Base/Ability"

export default class huskar_burning_spear extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Huskar_Burning_Spear>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("huskar_burning_spear", huskar_burning_spear)
