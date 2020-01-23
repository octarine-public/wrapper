import Ability from "../../Base/Ability"

export default class templar_assassin_trap_teleport extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_TemplarAssassin_Trap_Teleport>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_trap_teleport", templar_assassin_trap_teleport)
