
import { Game, Vector3, Team, Courier, Unit, DOTA_GameMode } from "wrapper/Imports";
import { LaneSelectionFlags_t, Data } from "./Data";
import { Owner } from "bootstrap";

class CourierData extends Data {
	public roles = new Array<LaneSelectionFlags_t[]>(2).fill(new Array<LaneSelectionFlags_t>(5).fill(LaneSelectionFlags_t.MID_LANE))
	public AUTO_USE_ITEMS = false
	public DELIVER_DISABLE = false
	public get CastDelay() {
		return (((Game.Ping / 2) + 30) + 250)
	}
	public IsValidCourier = (cour: Courier) => Game.GameMode !== DOTA_GameMode.DOTA_GAMEMODE_TURBO && cour !== undefined && cour.IsControllable && cour.IsAlive
	public CastCourAbility = (num: number, cour: Courier) => cour.IsControllable && cour.AbilitiesBook.GetSpell(num).UseAbility()
	public Position(BestOrSafe: boolean = false, custom_line?: LaneSelectionFlags_t): Vector3 {
		let num = 2, team_id = this.Team ? 1 : 0,
			roles = !custom_line ? this.roles[team_id].find((role, i) => role !== undefined) : custom_line
		return roles === undefined
			? this.CourierBestPosition[team_id][num * 2]
			: !BestOrSafe
				? Game.RawGameTime < 700
					? this.CourierBestPosition[team_id][roles]
					: this.CourierBestPosition[team_id][!custom_line ? num * 2 : custom_line]
				: this.CourierBestPosition[num][team_id]
	}
	public IsRangeCourier(unit: Unit, unit2: Courier | Vector3 = this.Position(), range: number = (unit.AttackRange + 450)) {
		return unit.IsInRange(unit2, range)
	}
	private get Team() {
		return Owner?.Team === Team.Dire
	}
	private readonly CourierBestPosition = {
		0: { // team_id
			1: this.SAFE_LANE_RADDIANT,
			2: this.OFFLANE_LANE_RADDIANT,
			4: this.MIDDLE_LANE_RADDIANT,
			8: this.SOFT_SUPPORT_RADDIANT,
			16: this.HARD_SUPPORT_RADDIANT,
		},
		1: { // team_id
			1: this.SAFE_LANE_DIRE,
			2: this.OFFLANE_LANE_DIRE,
			4: this.MIDDLE_LANE_DIRE,
			8: this.SOFT_SUPPORT_DIRE,
			16: this.HARD_SUPPORT_DIRE,
		},
		2: { // team_id
			0: this.SAFE_POSITION_RADDIANT,
			1: this.SAFE_POSITION_DIRE,
		}
	}
}
export let CourierBase = new CourierData