import { Vector3, Team, Hero, pudge_meat_hook, Obstacle, Vector2, Entity, Unit, MovingObstacle, NavMeshPathfinding, MathSDK, Creep, GameSleeper } from "./wrapper/Imports"

let menu = Menu.AddEntry(["Utility", "Good Respawn"])
let visuals_state = menu.AddToggle("Visuals State", true)
let debug_visuals_state = menu.AddToggle("Debug Visuals State", false)
let autohook_state = menu.AddToggle("AutoHook State", true)
let autohook_delay = menu.AddSlider("AutoHook Delay", 0, -6, 6)
let lock_position = menu.AddToggle("Lock position to 1 hook", false)
let manual_fix = menu.AddSlider("Manual position fix", 0, 0, 14)

function GetPositions(): Vector3[] {
	return EntityManager.AllEntities
		.filter(e => e.Name === (LocalPlayer?.Team === Team.Dire ? "info_player_start_goodguys" : "info_player_start_badguys"))
		.map(a => a.Position)
}

EventsSDK.on("Draw", () => {
	if (!visuals_state.value)
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
		if (PlayerResource.PlayerData[i].m_iPlayerTeam === LocalPlayer?.Team)
			continue

		let ent = EntityManager.GetEntityByNative(team_data.m_hSelectedHero)
		if (!(ent instanceof Hero))
			continue

		let respawn_time = ent.RespawnTime - Game.RawGameTime
		if (respawn_time <= 0)
			respawn_time = team_data.m_iRespawnSeconds
		if (respawn_time <= 0)
			continue

		ar.push(respawn_time)
	}
	// loop-optimizer: FORWARD
	ar.sort((a, b) => a - b).forEach((respawn_time, i) => {
		let screen_pos = RendererSDK.WorldToScreen(positions[positions.length !== 0 ? (next_spawn - (ar.length - i - 1)) % positions.length : 0])
		if (screen_pos !== undefined) {
			RendererSDK.FilledRect(screen_pos.SubtractScalar(2).AddScalarX(-4), new Vector2(20, 23), new Color(0, 255, 0))
			RendererSDK.Text(respawn_time.toFixed(1), screen_pos, new Color(255, 0, 0))
		}
	})
})

function TryPredict(
	start_pos: Vector2,
	hook: pudge_meat_hook,
	rad: number,
	obstacles: Obstacle[],
	obs2ent: Map<Obstacle, Entity>,
	owner: Unit,
	target: Entity,
): Nullable<[Vector3, number]> {
	let angle = Vector3.FromAngle(rad)
	let predict_res = new NavMeshPathfinding(
		new MovingObstacle(
			start_pos/*.Add(angle.toVector2().MultiplyScalar(hook.AOERadius * 1.5))*/,
			hook.AOERadius,
			angle.toVector2().MultiplyScalarForThis(hook.Speed),
			hook.CastRange / hook.Speed
		),
		obstacles,
		hook.CastPoint + owner!.TurnTime(owner!.Position.Rotation(angle, 100)) + (Game.Ping / 2000),
	).GetFirstHitObstacle()
	if (predict_res === undefined)
		return undefined
	if (obs2ent.get(predict_res[0]) === target)
		return [angle, predict_res[1]]
	return undefined
}

function TryPredictInAngles(
	base_ang: number,
	min: number, max: number,
	start_pos: Vector2,
	hook: pudge_meat_hook,
	obstacles: Obstacle[],
	obs2ent: Map<Obstacle, Entity>,
	owner: Unit,
	target: Entity,
): Nullable<[Vector3, number]> {
	for (let deg = min; deg < max; deg++) {
		let predicted_angle = TryPredict(start_pos, hook, base_ang + MathSDK.DegreesToRadian(deg), obstacles, obs2ent, owner, target)
		if (predicted_angle !== undefined)
			return predicted_angle
	}
	return undefined
}

function GetEnemyDeaths() {
	let deaths = 0
	for (let i = 0; i < PlayerResource.PlayerData.length; i++) {
		let team_data = PlayerResource.PlayerTeamData[i]
		if (PlayerResource.PlayerData[i].m_iPlayerTeam !== LocalPlayer?.Team)
			deaths += team_data.m_iDeaths
	}
	return deaths
}
function GetNextSpawn() {
	return manual_fix.value + 4 + PlayerResource.PlayerData.filter(data => data.m_iPlayerTeam !== LocalPlayer?.Team).length + GetEnemyDeaths()
}

let hook_sleeper = new GameSleeper()
EventsSDK.on("Tick", () => {
	if (!autohook_state.value)
		return
	let positions = GetPositions(),
		next_spawn = GetNextSpawn()
	let ar: [number, Hero][] = []
	for (let i = 0; i < PlayerResource.PlayerTeamData.length; i++) {
		let team_data = PlayerResource.PlayerTeamData[i]
		if (PlayerResource.PlayerData[i].m_iPlayerTeam === LocalPlayer?.Team)
			continue

		let ent = EntityManager.GetEntityByNative(team_data.m_hSelectedHero)
		if (!(ent instanceof Hero))
			continue

		let respawn_time = ent.RespawnTime - Game.RawGameTime
		if (respawn_time <= 0)
			respawn_time = team_data.m_iRespawnSeconds
		if (respawn_time <= 0)
			continue

		ar.push([respawn_time, ent])
	}
	// loop-optimizer: FORWARD
	ar.sort(([a], [b]) => a - b).forEach(([respawn_time, target], i) => {
		if (respawn_time > 4)
			return
		let pos = positions[positions.length !== 0 ? (next_spawn - (ar.length - i - 1)) % positions.length : 0]
		if (hook_sleeper.Sleeping(pos.LengthSqr))
			return
		EntityManager.GetEntitiesByClass(Unit).some(unit => {
			if (!unit.IsAlive || !unit.IsControllable || unit.IsEnemy() || unit.IsInvulnerable || hook_sleeper.Sleeping(unit) || unit.IsInAbilityPhase)
				return false

			const hook = unit.GetAbilityByClass(pudge_meat_hook)
			if (hook === undefined || !hook.IsCooldownReady || !unit.IsInRange(pos, hook.CastRange + hook.AOERadius))
				return false

			const obs2ent = new Map<Obstacle, Entity>(),
				start_pos = unit.Position.toVector2(),
				base_ang = unit.Position.GetDirectionTo(pos).Angle
			EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
				if (ent !== unit && ((ent.IsAlive && ent.IsInRange(unit, hook.CastRange * 2) && !ent.IsInvulnerable && ent.IsVisible) || ent === target))
					obs2ent.set(
						ent !== target
							? MovingObstacle.FromUnit(ent)
							: new Obstacle(pos.toVector2(), ent.HullRadius),
						ent
					)
			})
			let obstacles = [...obs2ent.keys()]
			let result = TryPredictInAngles(base_ang, -90, 90, start_pos, hook, obstacles, obs2ent, unit, target)
			if (result !== undefined && respawn_time - hook.CastPoint <= result[1] + (autohook_delay.value / 60)) {
				unit.CastPosition(hook, unit.Position.Rotation(result[0], 300))
				hook_sleeper.Sleep(Game.Ping + (hook.CastPoint + result[1]) * 1000, unit)
				if (lock_position.value)
					hook_sleeper.Sleep(Game.Ping + (hook.CastPoint + result[1]) * 1000, pos.LengthSqr)
				return true
			}
		})
	})
})

EventsSDK.on("PrepareUnitOrders", args => !hook_sleeper.Sleeping(args.Unit))
EventsSDK.on("GameEnded", () => {
	hook_sleeper.FullReset()
})
