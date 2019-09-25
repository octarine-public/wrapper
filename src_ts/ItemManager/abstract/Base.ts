import { EntityManager } from "wrapper/Imports"

export default class ItemManagerBase {
	constructor() {}
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public get IsSpectator(): boolean {
		let LocalPlayer = EntityManager.LocalPlayer
		return LocalPlayer !== undefined && LocalPlayer.Team === 1
	}
}