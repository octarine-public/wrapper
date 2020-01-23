import Ability from "../../Base/Ability"

export default class phantom_assassin_stifling_dagger extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_PhantomAssassin_Stifling_Dagger>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_assassin_stifling_dagger", phantom_assassin_stifling_dagger)
