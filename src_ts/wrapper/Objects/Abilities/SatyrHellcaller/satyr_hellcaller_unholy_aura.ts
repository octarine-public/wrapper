import Ability from "../../Base/Ability"

export default class satyr_hellcaller_unholy_aura extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SatyrHellcaller_UnholyAura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("satyr_hellcaller_unholy_aura", satyr_hellcaller_unholy_aura)
