import {
	ArrayExtensions,
	Color,
	Entity,
	EntityManager,
	EventsSDK,
	Game,
	Hero,
	LocalPlayer,
	Menu as MenuSDK,
	ParticlesSDK,
	RendererSDK,
	Team,
	Vector2,
	Vector3,
} from "wrapper/Imports"

//font = Renderer.LoadFont("Tahoma", 22, Enum.FontWeight.EXTRABOLD)

const Menu = MenuSDK.AddEntry(["Visual", "Show Wards"]),
	optionEnable = Menu.AddToggle("Enable"),
	//optionPingTeam = Menu.AddToggle("Ping for team"),
	optionPlaySound = Menu.AddToggle("Play sound")

optionEnable.OnValueChangedCBs.push(() => {
	if (!optionEnable.value)
		ClearAll()
})

let wardCaptureTiming = 0

let wardDispenserCount: Array<{
	sentry: number,
	observer: number,
}> = []
let wardProcessingTable: Array<{
	dieTime: number,
	type: "observer" | "sentry",
	pos: Vector3,
	unit: Hero,
}> = []

let heroes: Hero[] = []

function ClearAll() {
	wardCaptureTiming = 0
	wardDispenserCount = []
	wardProcessingTable = []
	heroes = []
}

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Hero && !ent.IsIllusion)
		heroes.push(ent)
})

EventsSDK.on("GameEnded", ClearAll)

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero) {
		ArrayExtensions.arrayRemove(heroes, ent)
		return
	}

	let is_observer = ent.Name === "npc_dota_ward_base"
	let is_sentry = ent.Name === "npc_dota_ward_base_truesight"

	if (is_observer || is_sentry) {
		// loop-optimizer: KEEP
		let nearest_ward = ArrayExtensions.orderBy (
			wardProcessingTable.filter(ward => (is_observer && ward.type === "observer") || (is_sentry && ward.type === "sentry")),
			ward => ent.Distance(ward.pos),
		)[0]
		if (nearest_ward !== undefined && ent.Distance(nearest_ward.pos) < 1500)
			ArrayExtensions.arrayRemove(wardProcessingTable, nearest_ward)
	}
})

function PingEnemyWard(pos: Vector3, hero: Entity) {
	//if (optionPingTeam.value) {
	//	pos.toIOBuffer();
	//	Minimap.SendPing(PingType_t.ENEMY_VISION, false, hero.m_pBaseEntity);
	//}

	let map_ping = ParticlesSDK.Create (
		"particles/ui_mouseactions/ping_enemyward.vpcf",
		ParticleAttachment_t.PATTACH_WORLDORIGIN,
		hero,
	)

	ParticlesSDK.SetControlPoint(map_ping, 0, pos)
	ParticlesSDK.SetControlPoint(map_ping, 1, new Vector3(1, 1, 1))
	ParticlesSDK.SetControlPoint(map_ping, 5, new Vector3(10, 0, 0))

	if (optionPlaySound.value) {
		Game.ExecuteCommand("playvol sounds/ui/ping_warning 0.2")
	}
}

EventsSDK.on("Update", () => {
	if(LocalPlayer === undefined) {
		return false
	}
	if (!optionEnable.value || LocalPlayer.IsSpectator) {
		return
	}

	// loop-optimizer: KEEP
	wardProcessingTable = wardProcessingTable.filter(l => l.dieTime > Game.GameTime)

	if (Game.GameTime - wardCaptureTiming < 0.1)
		return

	heroes.forEach(hero => {
		if (!hero.IsEnemy())
			return
		if (hero.IsAlive && !hero.IsDormant) {
			let sentry = hero.GetItemByName("item_ward_sentry"),
				observer = hero.GetItemByName("item_ward_observer"),
				dispenser = hero.GetItemByName("item_ward_dispenser")

			let sentry_stack = 0,
				observer_stack = 0,
				owner_idx = hero.Index

			let unique_id = owner_idx + Math.floor(Game.GameTime)

			if (sentry !== undefined) {
				sentry_stack = sentry.CurrentCharges
			} else if (observer !== undefined) {
				observer_stack = observer.CurrentCharges
			} else if (dispenser !== undefined) {
				sentry_stack = dispenser.SecondaryCharges
				observer_stack = dispenser.CurrentCharges
			}

			if (sentry_stack === 0 && observer_stack === 0) {
				if (wardDispenserCount[owner_idx] === undefined) {
					wardCaptureTiming = Game.GameTime
				}
				else {
					let ward_type: "sentry" | "observer"

					if (wardDispenserCount[owner_idx].sentry > sentry_stack)
						ward_type = "sentry"
					else if (wardDispenserCount[owner_idx].observer > observer_stack)
						ward_type = "observer"

					if (ward_type !== undefined) {
						wardProcessingTable[unique_id] = {
							type: ward_type,
							pos: hero.Position,
							dieTime: Math.floor(Game.GameTime + 360),
							unit: hero,
						}

						PingEnemyWard(hero.Position, hero)

						wardDispenserCount[owner_idx] = undefined
						wardCaptureTiming = Game.GameTime
					}
				}
			}

			if (wardDispenserCount[owner_idx] === undefined) {
				if (sentry_stack > 0 || observer_stack > 0) {
					wardDispenserCount[owner_idx] =
						{
							sentry: sentry_stack,
							observer: observer_stack,
						}

					wardCaptureTiming = Game.GameTime
				}
			}
			else {
				if (!(
					wardDispenserCount[owner_idx].sentry < sentry_stack ||
					wardDispenserCount[owner_idx].observer < observer_stack
				)) {
					let ward_type

					if (wardDispenserCount[owner_idx].sentry > sentry_stack) {
						ward_type = "sentry"
					}
					else if (wardDispenserCount[owner_idx].observer > observer_stack) {
						ward_type = "observer"
					}

					if (ward_type !== undefined) {
						wardProcessingTable[unique_id] =
							{
								type: ward_type,
								pos: hero.Position,
								dieTime: Math.floor(Game.GameTime + 360),
								unit: hero,
							}

						PingEnemyWard(hero.Position, hero)
					}
				}

				wardDispenserCount[owner_idx] = {
					sentry: sentry_stack,
					observer: observer_stack,
				}

				wardCaptureTiming = Game.GameTime
			}
		} else if (hero !== undefined && hero.IsDormant) {
			wardDispenserCount[hero.Index] = undefined
			wardCaptureTiming = Game.GameTime
		}
	})
})

EventsSDK.on("Draw", () => {
	if(LocalPlayer === undefined) {
		return false
	}
	if (!optionEnable.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator) {
		return false
	}
	// loop-optimizer: KEEP
	wardProcessingTable.forEach((v, i) => {
		if (v.dieTime < Game.GameTime) {
			wardProcessingTable.splice(i, 1)
			return
		}
		let screen_pos = RendererSDK.WorldToScreen(v.pos),
			type = v.type

		if (screen_pos === undefined)
			return
		RendererSDK.Image (
			"panorama\\images\\icon_ward_psd.vtex_c",
			new Vector2(screen_pos.x - 15, screen_pos.y - 15),
			new Vector2(30, 30),
			(type === "sentry" ? new Color(15, 0, 221) : new Color(222, 170, 0)), //observer
		)

		let seconds = Math.floor(v.dieTime - Game.GameTime)
		RendererSDK.Text (
			Math.floor(seconds / 60) + ":" + ((seconds % 60) < 10 ? "0" : "") + seconds % 60,
			new Vector2(screen_pos.x - 15, screen_pos.y + 15),
		)
	})
})
