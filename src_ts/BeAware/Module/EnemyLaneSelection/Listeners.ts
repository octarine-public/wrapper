import { Game, LocalPlayer, RendererSDK, Team, Vector2, DOTA_GameState } from "wrapper/Imports"
import {
	//ShowAfterGameStart,
	ChatTimeOutSend,
	ChatTimeOutSendRepeat, DrawPositionGap, DrawPositionX, DrawPositionY, SendAlliesChat, State
} from "./Menu"

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
	if (id === 2004) {
		// loop-optimizer: KEEP
		roles[0] = (obj as CSODOTALobby).members.filter(member => member.team === 0).map(member => member.lane_selection_flags)
		// loop-optimizer: KEEP
		roles[1] = (obj as CSODOTALobby).members.filter(member => member.team === 1).map(member => member.lane_selection_flags)
	}
})

ChatTimeOutSendRepeat.OnValue(x => {
	chat_start = hrtime()
	chat_id = 0
	need_chat = false
})

let team_offset = 250,
	first_offset = 125,
	chat_start = 0,
	chat_id = 0,
	need_chat = true
export function Draw() {
	let enemy_team_id = LocalPlayer?.Team === Team.Radiant ? 1 : 0
	if (chat_start !== 0 && chat_start < hrtime()) {
		if (SendAlliesChat.value) {
			let role_str = GetLaneName(roles[enemy_team_id][chat_id])
			Game.ExecuteCommand("say_team " + (chat_id + 1) + " slot " + role_str)
			chat_id++
			chat_start = chat_id < 5 ? hrtime() + 0.5 : 0
		} else
			chat_start = 0
	}
	if (!State.value || !Game.IsConnected || Game.GameState >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME || roles.length === 0)
		return
	let wSize = RendererSDK.WindowSize,
		ratio = RendererSDK.GetAspectRatio()
	switch (ratio) {
		case "4x3":
			team_offset = 230
			break
		case "16x9":
			if (wSize.x === 1280 && wSize.y === 720)
				team_offset = 160
			break
	}
	let base_enemy_pos = new Vector2(first_offset + (DrawPositionGap.value * 5 + team_offset) * enemy_team_id + wSize.x / 100, DrawPositionY.value)

	roles[enemy_team_id].forEach((role, i) => {
		let role_str = GetLaneName(role)
		if (role_str === undefined)
			return
		RendererSDK.Text(role_str, base_enemy_pos.Clone().AddScalarX(i * DrawPositionGap.value + DrawPositionX.value))
	})
	if (need_chat) {
		chat_start = hrtime() + ChatTimeOutSend.value * 1000
		need_chat = false
	}
}
export function Init() {
	roles = []
	chat_start = 0
	chat_id = 0
	need_chat = true
}
