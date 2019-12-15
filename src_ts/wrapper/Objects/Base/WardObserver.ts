import Entity from "./Entity"

export default class WardObserver extends Entity {
	public readonly m_pBaseEntity!: CDOTA_NPC_Observer_Ward

	public get Duration(): number {
		return this.m_pBaseEntity.m_iDuration
	}
	public get PreviewViewer(): number {
		return this.m_pBaseEntity.m_nPreviewViewer
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward", WardObserver)
