import Ability from "../../Base/Ability"

export default class greevil_miniboss_white_degen_aura extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Greevil_Miniboss_White_Degen_Aura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_white_degen_aura", greevil_miniboss_white_degen_aura)
