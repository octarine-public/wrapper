import { Color, Game, RendererSDK, LocalPlayer, Team, Vector2 } from "wrapper/Imports"
import { ShowAfterGameStart, State } from "./Menu"

enum LaneSelectionFlags_t {
	SAFE_LANE = 1 << 0,
	OFF_LANE = 1 << 1,
	MID_LANE = 1 << 2,
	SOFT_SUPPORT = 1 << 3,
	HARD_SUPPORT = 1 << 4,
}

let roles = new Array<LaneSelectionFlags_t[]>(2).fill(new Array<LaneSelectionFlags_t>(5).fill(LaneSelectionFlags_t.MID_LANE))

interface CDOTALobbyMember {
	id: bigint // steamid
	team: number
	party_id: bigint
	meta_level: number
	lane_selection_flags: LaneSelectionFlags_t
}

interface CSODOTALobby {
	members: CDOTALobbyMember[]
}

function GetLaneName(lane_selection_flags: LaneSelectionFlags_t) {
	switch (lane_selection_flags) {
		case LaneSelectionFlags_t.HARD_SUPPORT:
			return "Hard Support"
		case LaneSelectionFlags_t.MID_LANE:
			return "Mid Lane"
		case LaneSelectionFlags_t.OFF_LANE:
			return "Off Lane"
		case LaneSelectionFlags_t.SAFE_LANE:
			return "Safe Lane"
		case LaneSelectionFlags_t.SOFT_SUPPORT:
			return "Soft Support"
		default:
			return undefined
	}
}

Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	if (id === 2004 && reason === 0) {
		// loop-optimizer: KEEP
		roles[0] = (obj as CSODOTALobby).members.filter(member => member.team === 0).map(member => member.lane_selection_flags)
		// loop-optimizer: KEEP
		roles[1] = (obj as CSODOTALobby).members.filter(member => member.team === 1).map(member => member.lane_selection_flags)
	}
})

let player_size = 150
let team_offset = 300
export function Draw() {
	if (!State.value || !Game.IsConnected || LocalPlayer === undefined)
		return
	let is_in_game = Game.GameState >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME
	if (!ShowAfterGameStart.value && is_in_game)
		return
	let enemy_team_id = (LocalPlayer.Team - Team.Radiant) ^ 1
	let base_enemy_pos = new Vector2(20 + (player_size * 5 + team_offset) * enemy_team_id, 100)
	roles[enemy_team_id].forEach((role, i) => {
		let role_str = GetLaneName(role)
		if (role_str === undefined)
			return
		RendererSDK.Text (
			role_str,
			base_enemy_pos.Clone().AddScalarX(i * player_size)
		)
	})
}
