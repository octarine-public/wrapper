import {
	ArrayExtensions,
	Color,
	Entity,
	EventsSDK,
	Game,
	Hero,
	LocalPlayer,
	MenuManager,
	PhysicalItem,
	RendererSDK,
	Rune,
	Unit,
	Vector3,
} from "wrapper/Imports"

//import { PickupItem, PickupRune } from "../Orders"
//import * as Utils from "../Utils"

let { MenuFactory, CreateRGBTree } = MenuManager

let allRunes: Rune[] = [],
	allRunesParticles: number[][] = [],
	ground_items: PhysicalItem[] = [],
	npcs: Unit[] = [],
	picking_up: Rune[] = []

const snatcherMenu = MenuFactory("Snatcher")

const stateMain = snatcherMenu.AddToggle("State")
	.OnValue(() => {
		destroyRuneAllParticles()
		onDeactivateItems()
	})

// ----- Rune

const runeMenu = snatcherMenu.AddTree("Rune settings")

const stateRune = runeMenu.AddToggle("Snatch Rune").OnDeactivate(destroyRuneAllParticles)

runeMenu.AddKeybind("Rune toogle").OnRelease(() => stateRune.ChangeReverse())

const runeHoldKey = runeMenu.AddKeybind("Rune hold key").OnRelease(() => !stateRune.value && destroyRuneAllParticles())

// -- Draw particles

const drawParticles = runeMenu.AddTree("Draw indicators (particles)")

const drawParticleTake = drawParticles.AddToggle("Take rune")
	.OnValue(destroyRuneAllParticles)
	.OnActivate(self =>
		drawParticles.AddControl(drawParticleTake_Color.tree, self.IndexInMenu + 1))
	.OnDeactivate(() =>
		drawParticles.RemoveControl(drawParticleTake_Color.tree))

const drawParticleTake_Color = CreateRGBTree(drawParticleTake.value ? drawParticles : undefined, "indicators color")

drawParticleTake_Color.R.OnValue(updateRuneAllParticle)
drawParticleTake_Color.G.OnValue(updateRuneAllParticle)
drawParticleTake_Color.B.OnValue(updateRuneAllParticle)

const drawParticleKill = drawParticles.AddToggle("Kill rune")
	.SetToolTip("Color for kill - Red")
	.OnValue(destroyRuneAllParticles)

// ----- Items

const itemsMenu = snatcherMenu.AddTree("Items settings")

const stateItems = itemsMenu.AddToggle("Snatch Items").OnDeactivate(onDeactivateItems)

itemsMenu.AddKeybind("Items toogle").OnRelease(() => stateItems.ChangeReverse())

const itemsHoldKey = itemsMenu.AddKeybind("Items hold key").OnRelease(() => !stateItems.value && onDeactivateItems())

const takeRadius = snatcherMenu.AddSlider("Pickup radius", 150, 50, 500, "Default range is 150, that one don't require rotating unit to pickup something")

const listOfItems = itemsMenu.AddListBox("Items for snatch",
	["item_gem", "item_cheese", "item_rapier", "item_aegis"],
	[true, true, true, true])

const stateControllables = snatcherMenu.AddToggle("Use other units")

// ----- Draw

const drawMenu = snatcherMenu.AddTree("Draw")
const drawStatus = drawMenu.AddToggle("Draw status"),
	statusPosX = drawMenu.AddSlider("Position X (%)", 0, 0, 100),
	statusPosY = drawMenu.AddSlider("Position Y (%)", 75, 0, 100)

function onDeactivateItems() {
	ground_items = []
}

EventsSDK.on("GameEnded", () => picking_up = [])

EventsSDK.on("EntityCreated", ent => {

	if (ent instanceof Rune) {
		allRunes.push(ent)
		return
	}

	if (ent instanceof PhysicalItem) {
		let m_hItem = ent.Item
		if (m_hItem !== undefined && listOfItems.IsSelected(m_hItem.Name))
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

EventsSDK.on("Update", () => {
	if (!stateMain.value || !Game.IsInGame || Game.IsPaused)
		return

	let controllables: Unit[] = stateControllables.value
		? GetControllables()
		: [LocalPlayer.Hero]

	snatchRunes(controllables)
	snatchItems(controllables)
})

EventsSDK.on("Draw", () => {
	if (!drawStatus.value || !Game.IsInGame)
		return

	let text = ""

	// rune
	text += `${stateRune.name}: ${(stateRune.value || runeHoldKey.IsPressed) ? "On" : "Off"}`

	text += " | "

	// items
	text += `${stateItems.name}: ${(stateItems.value || itemsHoldKey.IsPressed) ? "On" : "Off"}`

	const wSize = RendererSDK.WindowSize

	Renderer.Text(
		wSize.x / 100 * statusPosX.value,
		wSize.y / 100 * statusPosY.value,
		text,
	)
})

EventsSDK.on("PrepareUnitOrders", order => picking_up[(order.Unit as Unit).Index] === undefined)

function GetControllables() {
	return npcs.filter(npc =>
		(npc instanceof Hero || npc.m_pBaseEntity instanceof C_DOTA_Unit_SpiritBear)
		&& !npc.IsIllusion
		&& npc.IsRealUnit
		&& npc.IsControllable,
	)
}

// ------- Rune

function snatchRunes(controllables: Unit[]) {
	if (!stateRune.value && !runeHoldKey.IsPressed)
		return

	allRunes.forEach(rune => {
		let near = ArrayExtensions.orderBy(controllables, unit => unit.Distance(rune)).some(npc => snatchRuneByUnit(npc, rune))
		if (!near && (drawParticleTake.value || drawParticleKill.value))
			destroyRuneParticles(rune.Index)
	})
}

function snatchRuneByUnit(npc: Unit, rune: Rune) {
	let npc_id = npc.Index
	if (picking_up[npc_id] !== undefined)
		return false

	if (!npc.IsStunned && !npc.IsWaitingToSpawn) {
		const Distance = npc.Distance2D(rune)

		if (Distance <= takeRadius.value && !(npc.IsInvulnerable && Distance > 100)) {
			picking_up[npc_id] = rune
			npc.PickupRune(rune)
			return false
		}

		const attackRange = npc.AttackRange

		if (Distance >= Math.max(500, attackRange) * 2)
			return false

		if (drawParticleTake.value || drawParticleKill.value) {
			const runeID = rune.Index

			if (allRunesParticles[runeID] === undefined) {
				allRunesParticles[runeID] = []

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

	ArrayExtensions.arrayRemove(picking_up, rune, true)

	if (ArrayExtensions.arrayRemove(allRunes, rune))
		destroyRuneParticles(rune.Index)
}

function createRuneParticle(ent: Entity, color: Color, radius: number) {
	const particleID = Particles.Create (
		"particles/ui_mouseactions/drag_selected_ring.vpcf",
		ParticleAttachment_t.PATTACH_ABSORIGIN,
		ent.m_pBaseEntity,
	)

	color.toIOBuffer()
	Particles.SetControlPoint(particleID, 1)
	new Vector3(radius * 1.1, 255).toIOBuffer()
	Particles.SetControlPoint(particleID, 2)

	allRunesParticles[ent.Index].push(particleID)
}

function updateRuneAllParticle() {
	drawParticleTake_Color.Color.toIOBuffer()
	// loop-optimizer: POSSIBLE_UNDEFINED
	allRunesParticles.forEach(partcl => Particles.SetControlPoint(partcl[0], 1))
}

function destroyRuneParticles(runeID: number | string) {
	var particles = allRunesParticles[runeID] as number[]
	if (particles !== undefined) {
		// loop-optimizer: POSSIBLE_UNDEFINED
		particles.forEach(particleID =>
			Particles.Destroy(particleID, true))

		allRunesParticles[runeID] = undefined
	}
}

function destroyRuneAllParticles() {
	// loop-optimizer: POSSIBLE_UNDEFINED
	allRunesParticles.forEach(particles => {
		particles.forEach(particleID => Particles.Destroy(particleID, true))
	})

	allRunesParticles = []
}

// ------- Items

function snatchItems(controllables: Unit[]) {
	if ((!stateItems.value && !itemsHoldKey.IsPressed) || listOfItems.IsZeroSelected)
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