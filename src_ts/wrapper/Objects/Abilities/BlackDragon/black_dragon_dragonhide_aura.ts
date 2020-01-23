import Ability from "../../Base/Ability"

export default class black_dragon_dragonhide_aura extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_BlackDragon_DragonhideAura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("black_dragon_dragonhide_aura", black_dragon_dragonhide_aura)
