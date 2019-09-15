import { EntityManager } from "wrapper/Imports"

export default class ManagerBase {
	constructor() {

	}
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public get IsSpectator(): boolean {
		let LocalPlayer = EntityManager.LocalPlayer
		if (LocalPlayer === undefined)
			return false
		if (LocalPlayer.Team === 1)
			return true
	}
}