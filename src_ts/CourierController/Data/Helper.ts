
import { Game, Vector3, Team, Courier } from "wrapper/Imports"
import { Owner } from "../bootstrap"

class CourierData {
	// safe base
	private readonly CourierBestPosition = [
		new Vector3(6199.96875, 5822.375, 384),
		new Vector3(-6301.0625, -5868.59375, 384),
		new Vector3(6662.376953125, 6042.126953125, 512),
		new Vector3(-6683.90625, -6216.75, 512)
	]

	public get CastDelay() {
		return (((Game.Ping / 2) + 30) + 250)
	}

	public IsValidCourier = (cour: Courier) => cour !== undefined || !cour.IsControllable || !cour.IsAlive

	public CastCourAbility = (num: number, cour: Courier) => cour.IsControllable && cour.AbilitiesBook.GetSpell(num).UseAbility()

	public get DELIVER_DISABLE() {
		return this._DELIVER_DISABLE
	}

	public set DELIVER_DISABLE(set: boolean) {
		this._DELIVER_DISABLE = set
	}

	public get AUTO_USE_ITEMS() {
		return this._AUTO_USE_ITEMS
	}

	public set AUTO_USE_ITEMS(set: boolean) {
		this._AUTO_USE_ITEMS = set
	}

	public Position(BestOrSafe: boolean = false) {
		return !BestOrSafe ? this.Team
			? this.CourierBestPosition[0]
			: this.CourierBestPosition[1]
			: this.Team
				? this.CourierBestPosition[2]
				: this.CourierBestPosition[3]
	}
	private get Team() {
		return Owner !== undefined && Owner.Team === Team.Dire
	}
	private _AUTO_USE_ITEMS: boolean = false
	private _DELIVER_DISABLE: boolean = false
}
export let CourierBase = new CourierData