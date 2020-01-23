import Ability from "../../Base/Ability"

export default class ancient_apparition_chilling_touch extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_AncientApparition_ChillingTouch>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ancient_apparition_chilling_touch", ancient_apparition_chilling_touch)
