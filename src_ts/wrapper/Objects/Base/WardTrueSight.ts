import WardObserver from "./WardObserver"

export default class WardTrueSight extends WardObserver {
	public NativeEntity: Nullable<CDOTA_NPC_Observer_Ward_TrueSight>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward_TrueSight", WardTrueSight)
