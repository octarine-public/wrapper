import Ability from "../../Base/Ability"

export default class shadow_shaman_mass_serpent_ward extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ShadowShaman_MassSerpentWard>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_shaman_mass_serpent_ward", shadow_shaman_mass_serpent_ward)
