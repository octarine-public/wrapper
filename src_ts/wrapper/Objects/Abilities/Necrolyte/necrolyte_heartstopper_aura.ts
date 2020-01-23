import Ability from "../../Base/Ability"

export default class necrolyte_heartstopper_aura extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Necrolyte_Heartstopper_Aura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necrolyte_heartstopper_aura", necrolyte_heartstopper_aura)
