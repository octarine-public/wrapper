import Ability from "../../Base/Ability"

export default class blue_dragonspawn_overseer_devotion_aura extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BlueDragonspawnOverseer_DevotionAura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("blue_dragonspawn_overseer_devotion_aura", blue_dragonspawn_overseer_devotion_aura)
