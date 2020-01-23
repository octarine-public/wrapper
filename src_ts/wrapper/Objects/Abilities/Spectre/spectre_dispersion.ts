import Ability from "../../Base/Ability"

export default class spectre_dispersion extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Spectre_Dispersion>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spectre_dispersion", spectre_dispersion)
