// create unit e.g dota_create_unit npc_dota_hero_night_stalker / dota_create_unit npc_dota_hero_axe enemy
// destroy unit e.g npc_destroy {entity_name}/{class_name}/{entity_index}
// add level e.g dota_bot_give_level 30
// add item e.g dota_bot_give_item item_blink

import {
	AbilityData,
	Color,
	Entity,
	EventsSDK,
	GameState,
	Hero,
	InputManager,
	LocalPlayer,
	Menu,
	RendererSDK,
	Team,
	TickSleeper,
	Unit,
	UnitData,
	Vector2
} from "../../wrapper/Imports"

const MAX_ALLY_HEROES = 4
const MAX_ENEMY_HEROES = 5
const MAX_ITEMS_PER_HERO = 6

let heroNames: string[] = []
let unitNames: string[] = []
let itemNames: string[] = []

const ignored = new Set<string>()

let heroIdx = 0
let unitIdx = 0
let itemIdx = 0
let dataReady = false
let running = false
let paused = false
let waitingForEntity = false
let pendingEntity: Nullable<Unit>
let createEnemy = false
let allyHeroCount = 0
let enemyHeroCount = 0

const enum Phase {
	HeroCreate,
	HeroItems,
	HeroDestroy,
	UnitCreate,
	UnitDestroy,
	Done
}

let phase = Phase.HeroCreate
let currentName = ""

const sleeper = new TickSleeper()

const menu = Menu.AddEntry("TEST")
const startKEY = menu.AddKeybind("Start")
const endKEY = menu.AddKeybind("End")
const resetKEY = menu.AddKeybind("Reset")
const pauseKEY = menu.AddKeybind("Pause")

function isAllyTeam(team: Team): boolean {
	return team === (LocalPlayer?.Team ?? Team.Radiant)
}

function allyTeamStr(): string {
	return ""
}

function enemyTeamStr(): string {
	return "enemy"
}

function removeEntity(): void {
	if (pendingEntity !== undefined) {
		GameState.ExecuteCommand(`npc_destroy ${pendingEntity.Index}`)
	}
	pendingEntity = undefined
	waitingForEntity = false
	currentName = ""
}

startKEY.OnPressed(() => {
	if (!dataReady) return
	running = true
	paused = false
})

endKEY.OnPressed(() => {
	running = false
	paused = false
	removeEntity()
	phase = Phase.Done
})
resetKEY.OnPressed(() => {
	running = false
	paused = false
	removeEntity()
	ignored.clear()
	heroIdx = 0
	unitIdx = 0
	itemIdx = 0
	createEnemy = false
	phase = Phase.HeroCreate
})

pauseKEY.OnPressed(() => {
	paused = !paused
})

EventsSDK.on("UnitAbilityDataUpdated", () => {
	heroNames = [...UnitData.globalStorage.entries()]
		.filter(([name, data]) => data.HeroID > 0 && name !== "npc_dota_hero_base")
		.map(([name]) => name)

	const heroSet = new Set(heroNames)
	unitNames = [...UnitData.globalStorage.keys()].filter(
		name =>
			name.startsWith("npc_dota_") && !name.endsWith("_base") && !heroSet.has(name)
	)

	itemNames = [...AbilityData.globalStorage.keys()].filter(
		name => name.startsWith("item_") && !name.startsWith("item_recipe_")
	)

	dataReady = true
})

EventsSDK.on("EntityCreated", (ent: Entity) => {
	if (ent instanceof Hero) {
		if (isAllyTeam(ent.Team)) allyHeroCount++
		else enemyHeroCount++
	}
	if (!running || !waitingForEntity) return
	if (!(ent instanceof Unit)) return
	if (ent.Name === currentName) {
		pendingEntity = ent
		waitingForEntity = false
	}
})

EventsSDK.on("EntityDestroyed", (ent: Entity) => {
	if (ent instanceof Hero) {
		if (isAllyTeam(ent.Team)) allyHeroCount--
		else enemyHeroCount--
	}
	if (pendingEntity === ent) {
		pendingEntity = undefined
	}
})

function phaseName(): string {
	switch (phase) {
		case Phase.HeroCreate:
		case Phase.HeroItems:
		case Phase.HeroDestroy:
			return "Heroes"
		case Phase.UnitCreate:
		case Phase.UnitDestroy:
			return "Units"
		case Phase.Done:
			return "Done"
	}
}

function progress(): string {
	switch (phase) {
		case Phase.HeroCreate:
		case Phase.HeroItems:
		case Phase.HeroDestroy:
			return `${heroIdx}/${heroNames.length}`
		case Phase.UnitCreate:
		case Phase.UnitDestroy:
			return `${unitIdx}/${unitNames.length}`
		case Phase.Done:
			return `${ignored.size} total`
	}
}

function statusColor(): Color {
	if (!running) return Color.Gray
	if (paused) return Color.Yellow
	if (phase === Phase.Done) return Color.Green
	return Color.White
}

const drawPos = new Vector2(10, 300)
const lineHeight = 22

EventsSDK.on("Draw", () => {
	if (!dataReady) return

	const pos = drawPos.Clone()
	const status = !running ? "Stopped" : paused ? "Paused" : "Running"
	const col = statusColor()

	RendererSDK.Text(`[View Units] ${status}`, pos, col, undefined, 20, 600)
	pos.AddScalarY(lineHeight)

	RendererSDK.Text(`Phase: ${phaseName()} ${progress()}`, pos, col, undefined, 18)
	pos.AddScalarY(lineHeight)

	RendererSDK.Text(
		`Heroes: ally ${allyHeroCount}/${MAX_ALLY_HEROES} enemy ${enemyHeroCount}/${MAX_ENEMY_HEROES}`,
		pos,
		col,
		undefined,
		18
	)
	pos.AddScalarY(lineHeight)

	RendererSDK.Text(`Items: ${itemIdx}/${itemNames.length}`, pos, col, undefined, 18)
	pos.AddScalarY(lineHeight)

	RendererSDK.Text(`Ignored: ${ignored.size}`, pos, col, undefined, 18)
	pos.AddScalarY(lineHeight)

	if (currentName !== "") {
		const isHero =
			phase === Phase.HeroCreate ||
			phase === Phase.HeroItems ||
			phase === Phase.HeroDestroy
		const typeLabel = isHero ? "Hero" : "Unit"
		const teamLabel = isHero ? (createEnemy ? "enemy" : "ally") : ""
		const entityStatus = pendingEntity?.IsAlive
			? "alive"
			: waitingForEntity
				? "spawning..."
				: "dead"
		RendererSDK.Text(
			`${typeLabel}: ${currentName} [${entityStatus}] ${teamLabel}`,
			pos,
			Color.LightBlue,
			undefined,
			18
		)
		pos.AddScalarY(lineHeight)
	}
})

function giveItems(): void {
	let given = 0
	while (given < MAX_ITEMS_PER_HERO && itemIdx < itemNames.length) {
		const item = itemNames[itemIdx]
		itemIdx++
		if (ignored.has(item)) {
			continue
		}
		GameState.ExecuteCommand(`dota_bot_give_item ${item}`)
		ignored.add(item)
		given++
	}
}

function advanceIndex(names: string[], idx: { value: number }): boolean {
	while (idx.value < names.length && ignored.has(names[idx.value])) {
		idx.value++
	}
	return idx.value < names.length
}

EventsSDK.on("PostDataUpdate", dt => {
	if (dt === 0 || !dataReady || !running || paused || sleeper.Sleeping) {
		return
	}
	sleeper.Sleep(500)

	switch (phase) {
		case Phase.HeroCreate: {
			const idx = { value: heroIdx }
			if (!advanceIndex(heroNames, idx)) {
				heroIdx = idx.value
				phase = Phase.UnitCreate
				return
			}
			heroIdx = idx.value
			currentName = heroNames[heroIdx]

			const wantEnemy = !createEnemy
			const canAlly = allyHeroCount < MAX_ALLY_HEROES
			const canEnemy = enemyHeroCount < MAX_ENEMY_HEROES

			if (!canAlly && !canEnemy) {
				return
			}

			if (wantEnemy && canEnemy) {
				createEnemy = true
			} else if (!wantEnemy && canAlly) {
				createEnemy = false
			} else if (canEnemy) {
				createEnemy = true
			} else {
				createEnemy = false
			}

			waitingForEntity = true
			pendingEntity = undefined
			const team = createEnemy ? enemyTeamStr() : allyTeamStr()
			const cmd =
				team !== ""
					? `dota_create_unit ${currentName} ${team}`
					: `dota_create_unit ${currentName}`
			GameState.ExecuteCommand(cmd)
			phase = Phase.HeroItems
			break
		}

		case Phase.HeroItems: {
			if (waitingForEntity) {
				return
			}
			if (pendingEntity instanceof Hero) {
				GameState.ExecuteCommand("dota_bot_give_level 30")
				giveItems()
			}
			phase = Phase.HeroDestroy
			break
		}

		case Phase.HeroDestroy: {
			removeEntity()
			ignored.add(heroNames[heroIdx])
			heroIdx++
			phase = Phase.HeroCreate
			break
		}

		case Phase.UnitCreate: {
			const idx = { value: unitIdx }
			if (!advanceIndex(unitNames, idx)) {
				unitIdx = idx.value
				phase = Phase.Done
				running = false
				return
			}
			unitIdx = idx.value
			currentName = unitNames[unitIdx]
			waitingForEntity = true
			pendingEntity = undefined

			GameState.ExecuteCommand(`dota_create_unit ${currentName}`)
			phase = Phase.UnitDestroy
			break
		}

		case Phase.UnitDestroy: {
			if (waitingForEntity) {
				return
			}
			removeEntity()
			ignored.add(unitNames[unitIdx])
			unitIdx++
			phase = Phase.UnitCreate
			break
		}

		case Phase.Done:
			running = false
			break
	}
})
