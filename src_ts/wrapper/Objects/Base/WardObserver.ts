import Entity from "./Entity"

export default class WardObserver extends Entity {
	public NativeEntity: Nullable<CDOTA_NPC_Observer_Ward>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward", WardObserver)
