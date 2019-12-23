import {
	ArrayExtensions,
	Color,
	EventsSDK,
	Game,
	GameSleeper,
	Hero,
	LocalPlayer,
	Menu,
	ParticlesSDK,
	PhysicalItem,
	RendererSDK,
	Rune,
	Unit,
	Vector3,
	DOTAGameUIState_t,
} from "wrapper/Imports"

// import { PickupItem, PickupRune } from "../Orders"
// import * as Utils from "../Utils"

enum ESelectedType {
	ALL = 0,
	ONLY_BOUNTY = 1,
	ONLY_POWER = 2,
}

let allRunes: Rune[] = [],
	allRunesParticles = new Map<Rune, number[]>(),
	ground_items: PhysicalItem[] = [],
	npcs: Unit[] = [],
	picking_up = new Map<Unit, Rune>(),
	selectedRuneType: ESelectedType = ESelectedType.ALL,
	Sleep = new GameSleeper()
const snatcherMenu = Menu.AddEntry(["Utility", "Snatcher"])

const stateMain = snatcherMenu.AddToggle("State", true)
	.OnValue(() => {
		destroyRuneAllParticles()
		onDeactivateItems()
	})

// ----- Rune

const runeMenu = snatcherMenu.AddNode("Rune settings")

const stateRune = runeMenu.AddToggle("Snatch Rune", true).OnDeactivate(destroyRuneAllParticles)

const typesSelect = runeMenu.AddSwitcher("Runes for snatch", ["All", "Only Bounty", "Only PowerUps"])
typesSelect.OnValue(onTypeSelected)

runeMenu.AddKeybind("Rune toogle").OnRelease(() => stateRune.value = !stateRune.value)

const runeHoldKey = runeMenu.AddKeybind("Rune hold key").OnRelease(() => !stateRune.value && destroyRuneAllParticles())

// -- Draw particles

const drawParticles = runeMenu.AddNode("Draw indicators (particles)")

const drawParticleTake = drawParticles.AddToggle("Take rune")
	.OnValue(destroyRuneAllParticles)

const drawParticleTake_Color = drawParticles.AddColorPicker("indicators color")
drawParticleTake_Color.R.OnValue(updateRuneAllParticle)
drawParticleTake_Color.G.OnValue(updateRuneAllParticle)
drawParticleTake_Color.B.OnValue(updateRuneAllParticle)
drawParticleTake_Color.A.OnValue(updateRuneAllParticle)

const drawParticleKill = drawParticles.AddToggle("Kill rune")
	.SetTooltip("Color for kill - Red")
	.OnValue(destroyRuneAllParticles)

// ----- Items

const itemsMenu = snatcherMenu.AddNode("Items settings")

const stateItems = itemsMenu.AddToggle("Snatch Items", true).OnDeactivate(onDeactivateItems)

itemsMenu.AddKeybind("Items toogle").OnRelease(() => stateItems.value = !stateItems.value)

const itemsHoldKey = itemsMenu.AddKeybind("Items hold key").OnRelease(() => !stateItems.value && onDeactivateItems())

const takeRadius = snatcherMenu.AddSlider("Pickup radius", 150, 50, 500, "Default range is 150, that one don't require rotating unit to pickup something")

const listOfItems = itemsMenu.AddImageSelector("Items for snatch", [
	"item_gem",
	"item_cheese",
	"item_rapier",
	"item_aegis",
], new Map<string, boolean>([["item_gem", true], ["item_cheese", true], ["item_rapier", true], ["item_aegis", true]]))

const stateControllables = snatcherMenu.AddToggle("Use other units")

// ----- Draw

const drawMenu = snatcherMenu.AddNode("Draw")
const drawStatus = drawMenu.AddToggle("Draw status"),
	statusPosX = drawMenu.AddSlider("Position X (%)", 0, 0, 100),
	statusPosY = drawMenu.AddSlider("Position Y (%)", 75, 0, 100)

function onDeactivateItems() {
	ground_items = []
}

EventsSDK.on("GameEnded", () => {
	npcs = []
	Sleep.FullReset()
	ground_items = []
	picking_up.clear()
})

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Rune) {
		allRunes.push(ent)
		return
	}

	if (ent instanceof PhysicalItem) {
		let m_hItem = ent.Item
		if (m_hItem !== undefined && listOfItems.IsEnabled(m_hItem.Name))
			ground_items.push(ent)

		return
	}

	if (ent instanceof Unit) {
		npcs.push(ent)
		return
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Rune)
		removedIDRune(ent)
	else if (ent instanceof PhysicalItem)
		ArrayExtensions.arrayRemove(ground_items, ent)
	else if (ent instanceof Unit)
		ArrayExtensions.arrayRemove(npcs, ent)
})

EventsSDK.on("Tick", () => {
	if (LocalPlayer.IsSpectator || !stateMain.value)
		return false

	let controllables: Unit[] = stateControllables.value
		? GetControllables()
		: LocalPlayer.HeroAssigned ? [LocalPlayer.Hero] : []

	snatchRunes(controllables)
	snatchItems(controllables)
})

EventsSDK.on("Draw", () => {
	if (!drawStatus.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return

	let text = ""

	// rune
	text += `${stateRune.name}: ${(stateRune.value || runeHoldKey.is_pressed) ? "On" : "Off"}`

	text += " | "

	// items
	text += `${stateItems.name}: ${(stateItems.value || itemsHoldKey.is_pressed) ? "On" : "Off"}`

	RendererSDK.Text(text, RendererSDK.WindowSize.DivideScalar(100).MultiplyScalarX(statusPosX.value).MultiplyScalarY(statusPosY.value))
})

EventsSDK.on("PrepareUnitOrders", order => !picking_up.has(order.Unit as Unit))

function GetControllables() {
	return npcs.filter(npc =>
		(npc instanceof Hero || npc.m_pBaseEntity instanceof C_DOTA_Unit_SpiritBear)
		&& !npc.IsIllusion
		&& npc.IsRealUnit
		&& npc.IsControllable,
	)
}

// ------- Rune

function onTypeSelected(value) {
	selectedRuneType = value
}

function snatchRunes(controllables: Unit[]) {
	if (!stateRune.value && !runeHoldKey.is_pressed)
		return

	allRunes.forEach(rune => {
		if (selectedRuneType === ESelectedType.ONLY_BOUNTY && !rune.HasType(DOTA_RUNES.DOTA_RUNE_BOUNTY))
			return
		if (selectedRuneType === ESelectedType.ONLY_POWER && rune.HasType(DOTA_RUNES.DOTA_RUNE_BOUNTY))
			return
		let near = ArrayExtensions.orderBy(controllables, unit => unit.Distance(rune)).some(npc => snatchRuneByUnit(npc, rune))
		if (!near && (drawParticleTake.value || drawParticleKill.value))
			destroyRuneParticles(rune)
	})
}

function snatchRuneByUnit(npc: Unit, rune: Rune) {
	if (picking_up.has(npc) && Sleep.Sleeping("PickupRune"))
		return false

	if (!npc.IsStunned && !npc.IsWaitingToSpawn && npc.IsAlive) {
		const Distance = npc.Distance2D(rune)

		if (Distance <= takeRadius.value && !(npc.IsInvulnerable && Distance > 100)) {
			picking_up.set(npc, rune)
			npc.PickupRune(rune)
			Sleep.Sleep(30, "PickupRune")
			return false
		}

		const attackRange = npc.AttackRange

		if (Distance >= Math.max(500, attackRange) * 2)
			return false

		if (drawParticleTake.value || drawParticleKill.value) {
			if (!allRunesParticles.has(rune)) {
				allRunesParticles.set(rune, [])

				if (drawParticleTake.value)
					createRuneParticle(rune, new Color(0, 255), takeRadius.value)

				if (drawParticleKill.value)
					createRuneParticle(rune, new Color(255, 0), attackRange)
			}

		}
	}
	return true
}

function removedIDRune(rune: Rune) {
	for (let [unit, rune_] of picking_up.entries()) {
		if (rune !== rune_)
			continue
		picking_up.delete(unit)
		break
	}

	if (ArrayExtensions.arrayRemove(allRunes, rune))
		destroyRuneParticles(rune)
}

function createRuneParticle(ent: Rune, color: Color, radius: number) {
	const particleID = ParticlesSDK.Create(
		"particles/ui_mouseactions/drag_selected_ring.vpcf",
		ParticleAttachment_t.PATTACH_ABSORIGIN,
		ent,
	)

	ParticlesSDK.SetControlPoint(particleID, 1, new Vector3(color.r, color.g, color.b))
	ParticlesSDK.SetControlPoint(particleID, 2, new Vector3(radius * 1.1, 255))

	allRunesParticles.get(ent).push(particleID)
}

function updateRuneAllParticle() {
	let color = drawParticleTake_Color.Color
	let color_ = new Vector3(color.r, color.g, color.b)
	// loop-optimizer: POSSIBLE_UNDEFINED
	allRunesParticles.forEach(partcl => ParticlesSDK.SetControlPoint(partcl[0], 1, color_))
}

function destroyRuneParticles(rune: Rune) {
	if (!allRunesParticles.has(rune))
		return
	var particles = allRunesParticles.get(rune)
	// loop-optimizer: POSSIBLE_UNDEFINED
	particles.forEach(particleID => ParticlesSDK.Destroy(particleID, true))
	allRunesParticles.delete(rune)
}

function destroyRuneAllParticles() {
	// loop-optimizer: POSSIBLE_UNDEFINED
	allRunesParticles.forEach(particles => particles.forEach(particleID => ParticlesSDK.Destroy(particleID, true)))

	allRunesParticles.clear()
}

// ------- Items

function snatchItems(controllables: Unit[]) {
	if ((!stateItems.value && !itemsHoldKey.is_pressed) || listOfItems.IsZeroSelected)
		return

	let free_controllables = controllables

	ground_items.forEach(item => {
		let itemOwner = item.Item.OldOwner,
			can_take_backpack = item.Item.Name === "item_cheese"

		free_controllables.some((npc, index) => {
			if (itemOwner === npc || !npc.IsAlive || !npc.IsInRange(item, takeRadius.value) || !(npc.Inventory.HasFreeSlotsInventory || (can_take_backpack && npc.Inventory.HasFreeSlotsBackpack)))
				return false

			npc.PickupItem(item)
			free_controllables.splice(index, 1)
			return true
		})
	})
}
