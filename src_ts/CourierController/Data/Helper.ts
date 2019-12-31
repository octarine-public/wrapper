
import { Game, Vector3, Team, Courier, Unit, DOTA_GameMode } from "wrapper/Imports"
import { LaneSelectionFlags_t, Data } from "./Data"

class CourierData extends Data {
	public LAST_CLICK = false
	public AUTO_USE_ITEMS = false
	public DELIVER_DISABLE = false
	public roles = new Array<LaneSelectionFlags_t[]>(2).fill(new Array<LaneSelectionFlags_t>(5).fill(LaneSelectionFlags_t.MID_LANE))
	private readonly CourierBestPosition: { [teamid: number]: Vector3 }[] = [
		{ // team_id
			1: this.SAFE_LANE_RADDIANT,
			2: this.OFFLANE_LANE_RADDIANT,
			4: this.MIDDLE_LANE_RADDIANT,
			8: this.SOFT_SUPPORT_RADDIANT,
			16: this.HARD_SUPPORT_RADDIANT,
		},
		{ // team_id
			1: this.SAFE_LANE_DIRE,
			2: this.OFFLANE_LANE_DIRE,
			4: this.MIDDLE_LANE_DIRE,
			8: this.SOFT_SUPPORT_DIRE,
			16: this.HARD_SUPPORT_DIRE,
		},
		{ // team_id
			0: this.SAFE_POSITION_RADDIANT,
			1: this.SAFE_POSITION_DIRE,
		}
	]

	public get CastDelay() {
		return (((Game.Ping / 2) + 30) + 250)
	}
	private get Team() {
		return LocalPlayer?.Team === Team.Dire
	}

	public IsValidCourier = (cour: Courier) => Game.GameMode !== DOTA_GameMode.DOTA_GAMEMODE_TURBO
		&& cour !== undefined
		&& cour.IsAlive
		&& !cour.IsEnemy()
		&& cour.IsControllable

	public CastCourAbility = (num: number, cour: Courier) => cour.AbilitiesBook.GetSpell(num)?.UseAbility()

	public Position(BestOrSafe: boolean = false, custom_line?: LaneSelectionFlags_t): Vector3 {
		let num = 2, team_id = this.Team ? 1 : 0,
			roles = !custom_line && this.roles.length !== 0 ? this.roles[team_id].find((role, i) => role !== undefined) : custom_line
		return !BestOrSafe
			? Game.RawGameTime < 700
				? roles === undefined
					? this.CourierBestPosition[team_id][num * 2]
					: this.CourierBestPosition[team_id][roles]
				: this.CourierBestPosition[team_id][!custom_line ? num * 2 : custom_line]
			: this.CourierBestPosition[num][team_id]
	}
	public IsRangeCourier(unit: Unit, unit2: Courier | Vector3 = this.Position(), range: number = (unit.AttackRange + 450)) {
		return unit.IsInRange(unit2, range)
	}
}
export let CourierBase = new CourierData()
