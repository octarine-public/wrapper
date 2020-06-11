import { Utils, EventsSDK, Events, RendererSDK, Menu as MenuSDK, Color, GameState, DOTAGameUIState_t, GameRules, Vector2 } from "./wrapper/Imports"
import { RecursiveMap, } from "wrapper/Utils/ParseKV"

const Menu = MenuSDK.AddEntry(["Visual", "Finding Info"])
const State = Menu.AddToggle("State", false)
const TextPosition = Menu.AddVector2("Position", new Vector2(1, 7), new Vector2(1, 1), new Vector2(70, 70))
const TextSize = Menu.AddSlider("Text size", 14, 12, 48)
const BoldText = Menu.AddToggle("Bold text", true)

let kv = Utils.parseKVFile("scripts/matchgroups.txt")

interface CMsgDOTAMatchmakingStatsResponse {
	legacy_searching_players_by_group_source2: number[]
}

let UpdateDataRegion: Nullable<CMsgDOTAMatchmakingStatsResponse>

function LoadMatchGroups(): Map<number, string> {
	let values = [...((kv.get("matchgroups") as RecursiveMap) ?? new Map()).values()]
		.filter(a => a instanceof Map) as RecursiveMap[]
	return new Map(values.map(a => [parseInt(a.get("group") as string), a.get("channel") as string]))
}

EventsSDK.on("Draw", () => {
	if (UpdateDataRegion === undefined
		|| !State.value
		|| GameState.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME
		|| GameRules?.IsInGame
	) return

	let group_finder = UpdateDataRegion.legacy_searching_players_by_group_source2
	let current_id = 0
	RendererSDK.Text(
		`Finding match player counts:`,
		RendererSDK.WindowSize
			.DivideScalarForThis(100)
			.MultiplyForThis(TextPosition.Vector)
			.AddScalarY(current_id++ * TextSize.value),
		Color.White,
		"Calibri",
		TextSize.value,
		BoldText.value ? 700 : 400
	)
	LoadMatchGroups().forEach((name_server, key) => {
		let player_count = group_finder[key] ?? 0
		if (player_count === 0)
			return

		RendererSDK.Text(
			`${name_server.replace("Perfect World", "PW")}: ${player_count} players`,
			RendererSDK.WindowSize
				.DivideScalarForThis(100)
				.MultiplyForThis(TextPosition.Vector)
				.AddScalarY(current_id++ * TextSize.value),
			Color.White,
			"Calibri",
			TextSize.value,
			BoldText.value ? 700 : 400
		)
	})
})

Events.on("MatchmakingStatsUpdated", (data) => {
	if (!State.value)
		return
	UpdateDataRegion = data
})