import Ability from "../../Base/Ability"

export default class venomancer_poison_nova extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Venomancer_PoisonNova>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("venomancer_poison_nova", venomancer_poison_nova)
