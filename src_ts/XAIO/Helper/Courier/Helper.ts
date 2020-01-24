import { LaneSelectionFlags_t, CourierData } from "XAIO/Core/bootstrap"
import { GameRules, Vector3, Team, Courier, Unit, LocalPlayer, GameState, DOTA_GameMode, DOTA_GameState } from "wrapper/Imports"

export class CourierHelper {

	public static LAST_CLICK = false
	public static AUTO_USE_ITEMS = false
	public static DELIVER_DISABLE = false

	public static get TOBASE(): CourierState_t {
		return CourierState_t.COURIER_STATE_RETURNING_TO_BASE
	}

	public static get ATBASE(): CourierState_t {
		return CourierState_t.COURIER_STATE_AT_BASE
	}

	public static get DELIVERING(): CourierState_t {
		return CourierState_t.COURIER_STATE_DELIVERING_ITEMS
	}

	public static get IsTurbo(): boolean {
		return GameRules?.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO
	}

	public static get IsPreGame(): boolean {
		return GameRules?.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME
	}

	public static readonly WARNING_ABILITY: string[] = [
		"axe_culling_blade",
		"bane_brain_sap",
		"bane_fiends_grip",
		"lina_laguna_blade",
		"magnataur_reverse_polarity",
		"beastmaster_primal_roar",
		"pudge_dismember",
		"spirit_breaker_nether_strike",
		"batrider_flaming_lasso",
		"viper_viper_strike",
		"shadow_demon_demonic_purge"
	]

	public static get CastDelay() {
		return (((GameState.Ping / 2) + 30) + 250)
	}

	public static roles = new Array<LaneSelectionFlags_t[]>(2).fill(new Array<LaneSelectionFlags_t>(5).fill(LaneSelectionFlags_t.MID_LANE))

	public static AllowMap: string[] = [
		"dota",
		"start"
	]

	private static readonly CourierBestPosition: { [teamid: number]: Vector3 }[] = [
		{ // team_id
			1: CourierData.SAFE_LANE_RADDIANT,
			2: CourierData.OFFLANE_LANE_RADDIANT,
			4: CourierData.MIDDLE_LANE_RADDIANT,
			8: CourierData.SOFT_SUPPORT_RADDIANT,
			16: CourierData.HARD_SUPPORT_RADDIANT,
		},
		{ // team_id
			1: CourierData.SAFE_LANE_DIRE,
			2: CourierData.OFFLANE_LANE_DIRE,
			4: CourierData.MIDDLE_LANE_DIRE,
			8: CourierData.SOFT_SUPPORT_DIRE,
			16: CourierData.HARD_SUPPORT_DIRE,
		},
		{ // team_id
			0: CourierData.SAFE_POSITION_RADDIANT,
			1: CourierData.SAFE_POSITION_DIRE,
		}
	]

	private static get Team() {
		return LocalPlayer?.Team === Team.Dire
	}


	public static get OwnerIsValid(): Nullable<boolean> {
		return GameRules?.IsInGame && LocalPlayer!.Hero?.IsAlive && !LocalPlayer!.IsSpectator
	}

	public static IsValidCourier = (cour: Courier) => cour !== undefined
		&& cour.IsAlive
		&& !cour.IsEnemy()
		&& cour.IsControllable

	public static CastCourAbility = (num: number, cour: Courier) => cour.Spells[num]?.UseAbility()

	public static Position(BestOrSafe: boolean = false, custom_line?: LaneSelectionFlags_t): Vector3 {
		let num = 2, team_id = this.Team ? 1 : 0,
			roles = !custom_line && this.roles.length !== 0 ? this.roles[team_id].find(role => role !== undefined) : custom_line
		return !BestOrSafe
			? (GameRules?.RawGameTime ?? 0) < 700
				? roles === undefined
					? this.CourierBestPosition[team_id][num * 2]
					: this.CourierBestPosition[team_id][roles]
				: this.CourierBestPosition[team_id][!custom_line ? num * 2 : custom_line]
			: this.CourierBestPosition[num][team_id]
	}

	public static IsRangeCourier(unit: Unit, unit2: Courier | Vector3 = this.Position(), range: number = (unit.AttackRange + 450)) {
		return unit.IsInRange(unit2, range)
	}
}