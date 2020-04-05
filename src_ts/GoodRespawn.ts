import { Vector3, Hero, pudge_meat_hook, Obstacle, Vector2, Entity, Unit, MovingObstacle, NavMeshPathfinding, Creep, GameSleeper, EventsSDK, LocalPlayer, EntityManager, Menu, RendererSDK, Color, PlayerResource, GameRules, GameState, DOTAGameUIState_t, InfoPlayerStartDota } from "./wrapper/Imports"

let menu = Menu.AddEntry(["Utility", "Good Respawn"])
let visuals_state = menu.AddToggle("Visuals State", true),
	debug_visuals_state = menu.AddToggle("Debug Visuals State", false),
	autohook_state = menu.AddToggle("AutoHook State", true),
	autohook_delay = menu.AddSlider("AutoHook Delay", 0, -6, 6),
	lock_position = menu.AddToggle("Lock position to 1 hook", false),
	manual_fix = menu.AddSlider("Manual position fix", 0, 0, 14)

function GetPositions(): Vector3[] {
	return EntityManager.GetEntitiesByClass(InfoPlayerStartDota).filter(e => e.Team !== LocalPlayer?.Team).map(a => a.Position)
}

EventsSDK.on("Draw", () => {
	if (!visuals_state.value || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || PlayerResource === undefined)
		return
	let positions = GetPositions(),
		next_spawn = GetNextSpawn()
	if (debug_visuals_state.value) {
		// loop-optimizer: FORWARD
		positions.forEach((e, i) => {
			let screen_pos = RendererSDK.WorldToScreen(e)
			if (screen_pos === undefined)
				return
			RendererSDK.FilledRect(screen_pos.SubtractScalar(2).AddScalarX(-4), new Vector2(20, 23), new Color(255, 0, 0))
			RendererSDK.Text(i.toString(), screen_pos, new Color(0, 255, 0))
		})
	}
	let ar: number[] = []
	for (let i = 0; i < PlayerResource.PlayerTeamData.length; i++) {
		let team_data = PlayerResource.PlayerTeamData[i]
		if (PlayerResource.PlayerData[i].Team === LocalPlayer?.Team)
			continue

		let ent = EntityManager.EntityByIndex(team_data.SelectedHeroIndex)
		if (!(ent instanceof Hero))
			continue

		let respawn_time = ent.RespawnTime - GameRules!.RawGameTime
		if (respawn_time <= 0)
			respawn_time = team_data.RespawnSeconds
		if (respawn_time <= 0)
			continue

		ar.push(respawn_time)
	}
	// loop-optimizer: FORWARD
	ar.sort((a, b) => a - b).forEach((respawn_time, i) => {
		let pos = positions[positions.length !== 0 ? (next_spawn - (ar.length - i - 1)) % positions.length : 0]
		if (pos === undefined)
			return
		let screen_pos = RendererSDK.WorldToScreen(pos)
		if (screen_pos === undefined)
			return
		RendererSDK.FilledRect(screen_pos.SubtractScalar(2).AddScalarX(-4), new Vector2(20, 23), new Color(0, 255, 0))
		RendererSDK.Text(respawn_time.toFixed(1), screen_pos, new Color(255, 0, 0))
	})
})

function GetEnemyDeaths() {
	let deaths = 0
	for (let i = 0; i < PlayerResource!.PlayerData.length; i++) {
		let team_data = PlayerResource!.PlayerTeamData[i]
		if (team_data !== undefined && PlayerResource!.PlayerData[i].Team !== LocalPlayer?.Team)
			deaths += team_data.Deaths
	}
	return deaths
}
function GetNextSpawn() {
	return manual_fix.value + 4 + PlayerResource!.PlayerData.filter(data => data.Team !== LocalPlayer?.Team).length + GetEnemyDeaths()
}

let hook_sleeper = new GameSleeper()
EventsSDK.on("Tick", () => {
	if (!autohook_state.value || PlayerResource === undefined)
		return
	let positions = GetPositions(),
		next_spawn = GetNextSpawn()
	let ar: [number, Hero][] = []
	for (let i = 0; i < PlayerResource.PlayerTeamData.length; i++) {
		let team_data = PlayerResource.PlayerTeamData[i]
		if (PlayerResource.PlayerData[i].Team === LocalPlayer?.Team)
			continue

		let ent = EntityManager.EntityByIndex(team_data.SelectedHeroIndex)
		if (!(ent instanceof Hero))
			continue

		let respawn_time = ent.RespawnTime - GameRules!.RawGameTime
		if (respawn_time <= 0)
			respawn_time = team_data.RespawnSeconds
		if (respawn_time <= 0)
			continue

		ar.push([respawn_time, ent])
	}
	// loop-optimizer: FORWARD
	ar.sort(([a], [b]) => a - b).forEach(([respawn_time, target], i) => {
		if (respawn_time > 4)
			return
		let pos = positions[positions.length !== 0 ? (next_spawn - (ar.length - i - 1)) % positions.length : 0]
		if (pos === undefined || hook_sleeper.Sleeping(pos.LengthSqr))
			return
		EntityManager.GetEntitiesByClass(Unit).some(unit => {
			if (!unit.IsAlive || !unit.IsControllable || unit.IsEnemy() || unit.IsInvulnerable || hook_sleeper.Sleeping(unit) || unit.IsInAbilityPhase)
				return false

			const hook = unit.GetAbilityByClass(pudge_meat_hook)
			if (hook === undefined || !hook.IsCooldownReady || !unit.IsInRange(pos, hook.CastRange + hook.AOERadius))
				return false

			const obs2ent = new Map<Obstacle, Entity>(),
				start_pos = unit.Position.toVector2(),
				target_obs = new Obstacle(pos.toVector2(), target.HullRadius)
			EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
				if (ent !== unit && ((ent.IsAlive && ent.IsInRange(unit, hook.CastRange * 2) && !ent.IsInvulnerable && ent.IsVisible && !ent.IsEnemy()) || ent === target))
					obs2ent.set(
						ent !== target
							? MovingObstacle.FromUnit(ent)
							: target_obs,
						ent
					)
			})
			let predict_res = new NavMeshPathfinding(
				new MovingObstacle(
					start_pos/*.Add(angle.toVector2().MultiplyScalar(hook.AOERadius * 1.5))*/,
					hook.AOERadius,
					unit.Position.GetDirectionTo(pos).toVector2().MultiplyScalarForThis(hook.Speed),
					hook.CastRange / hook.Speed,
				),
				[...obs2ent.keys()],
				hook.CastPoint + unit.TurnTime(pos) + (autohook_delay.value / 60) + (GameState.Ping / 2000),
			).GetFirstHitObstacle()
			if (predict_res === undefined || predict_res[0] !== target_obs || respawn_time > predict_res[1] - (GameState.Ping / 2000))
				return false
			unit.CastPosition(hook, unit.Position.Extend(pos, hook.CastRange / 1.5))
			hook_sleeper.Sleep((GameState.Ping / 2) + (hook.CastPoint * 1000), unit)
			if (lock_position.value)
				hook_sleeper.Sleep((GameState.Ping / 2) + (hook.CastPoint * 1000), pos.LengthSqr)
			return true
		})
	})
})

EventsSDK.on("PrepareUnitOrders", args => !hook_sleeper.Sleeping(args.Unit))
EventsSDK.on("GameEnded", () => hook_sleeper.FullReset())
