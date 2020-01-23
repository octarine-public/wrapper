import Entity from "./Entity"

export default class WardObserver extends Entity {
	public NativeEntity: Nullable<CDOTA_NPC_Observer_Ward>
	public Duration = 0
	public PreviewViewer = 0
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward", WardObserver)
RegisterFieldHandler(WardObserver, "m_iDuration", (ward, new_value) => ward.Duration = new_value as number)
RegisterFieldHandler(WardObserver, "m_nPreviewViewer", (ward, new_value) => ward.PreviewViewer = new_value as number)
