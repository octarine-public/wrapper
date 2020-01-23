import Ability from "../../Base/Ability"

export default class invoker_wex extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_Wex>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_wex", invoker_wex)
