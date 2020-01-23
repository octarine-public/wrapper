import Ability from "../../Base/Ability"

export default class venomancer_plague_ward extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Venomancer_PlagueWard>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("venomancer_plague_ward", venomancer_plague_ward)
