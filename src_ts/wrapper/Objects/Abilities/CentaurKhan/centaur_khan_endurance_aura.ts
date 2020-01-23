import Ability from "../../Base/Ability"

export default class centaur_khan_endurance_aura extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_CentaurKhan_EnduranceAura
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("centaur_khan_endurance_aura", centaur_khan_endurance_aura)
