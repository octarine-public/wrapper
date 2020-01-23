import Ability from "../../Base/Ability"

export default class granite_golem_hp_aura extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_GraniteGolem_HPAura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("granite_golem_hp_aura", granite_golem_hp_aura)
