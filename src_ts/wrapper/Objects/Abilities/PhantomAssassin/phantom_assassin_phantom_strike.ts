import Ability from "../../Base/Ability"

export default class phantom_assassin_phantom_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_PhantomAssassin_PhantomStrike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_assassin_phantom_strike", phantom_assassin_phantom_strike)
