import Ability from "../../Base/Ability"

export default class alchemist_acid_spray extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Alchemist_AcidSpray>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("alchemist_acid_spray", alchemist_acid_spray)
