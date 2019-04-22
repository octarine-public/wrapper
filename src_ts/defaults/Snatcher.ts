import { CreateRGBTree, MenuManager } from "../CrutchesSDK/Wrapper"
import { PickupItem, PickupRune } from "../Orders"
import { orderBy } from "../Utils"

let registedEvents = {
		onEntityCreated: undefined,
		onEntityDestroyed: undefined,
		onTick: undefined,
		onPrepareUnitOrders: undefined,
		onDraw: undefined,
	},
	allRunes: C_DOTA_Item_Rune[] = [],
	allRunesParticles = [],
	needItems: C_DOTA_Item_Physical[] = [],
	npcs: C_DOTA_BaseNPC[] = [],
	picking_up: C_DOTA_Item_Rune[] = [],
	controllables: C_DOTA_BaseNPC[] = [];

const snatcherMenu = new MenuManager("Snatcher")

const stateMain = snatcherMenu.AddToggle("State").OnValue(onStateMain)

// ----- Rune

const runeMenu = snatcherMenu.AddTree("Rune settings")

const stateRune = runeMenu.AddToggle("Snatch Rune")
	.OnDeactivate(onDeactivateRune)
	.OnActivate(getAllEntities);

const runeToggle = runeMenu.AddKeybind("Rune toogle")
	.OnRelease(() => stateRune.ChangeReverse());

const runeHoldKey = runeMenu.AddKeybind("Rune hold key")
	.OnRelease(() => {
		if (!stateRune.value)
			onDeactivateRune()
	})

// -- Draw particles

const drawParticles = runeMenu.AddTree("Draw indicators (particles)")

const drawParticleTake = drawParticles.AddToggle("Take rune")
	.OnValue(destroyRuneAllParticles)
	.OnActivate(self =>
		drawParticles.AddControl(drawParticleTake_Color.tree, self.parent.entries.indexOf(self) + 1))
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

const stateItems = itemsMenu.AddToggle("Snatch Items")
	.OnDeactivate(onDeactivateItems)
	.OnActivate(getAllEntities);

const itemsToggle = itemsMenu.AddKeybind("Items toogle")
	.OnRelease(() => stateItems.ChangeReverse())

const itemsHoldKey = itemsMenu.AddKeybind("Items hold key")
	.OnRelease(() => {
		if (!stateItems.value)
			onDeactivateItems()
	})

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

function onStateMain(state: boolean = stateMain.value) {
	if (!state) {
		destroyEvents()

		onDeactivateRune()
		onDeactivateItems()
	} else
		registerEvents()
}

function getAllEntities() {
	// loop-optimizer: POSSIBLE_UNDEFINED
	Entities.GetAllEntities().forEach(ent => {
		if (ent.m_bIsValid)
			onCheckEntity(ent)
	});
}

function onDeactivateRune() {
	destroyRuneAllParticles()
	allRunes = []
}

function onDeactivateItems() {
	needItems = []
}

function registerEvents() {
	registedEvents.onEntityCreated = Events.addListener("onEntityCreated", onCheckEntity)
	registedEvents.onEntityDestroyed = Events.addListener("onEntityDestroyed", onEntityDestroyed)
	registedEvents.onTick = Events.addListener("onTick", onTick)
	registedEvents.onPrepareUnitOrders = Events.addListener("onPrepareUnitOrders", order => picking_up[order.unit.m_iID] === undefined)
	registedEvents.onDraw = Events.addListener("onDraw", onDraw)
	
	getAllEntities();
}

function destroyEvents() {
	for (const name in registedEvents) {
		let listenerID = registedEvents[name]
		if (listenerID !== undefined) {
			Events.removeListener(name, listenerID);
			registedEvents[name] = undefined;
		}
	}
}

function onCheckEntity(ent: C_BaseEntity) {
	if (ent instanceof C_DOTA_Item_Rune && (stateRune.value || runeHoldKey.IsPressed)) {
		
		if (!allRunes.includes(ent))
			allRunes.push(ent)
	}

	if (ent instanceof C_DOTA_Item_Physical && stateItems.value) {
		
		let m_hItem = ent.m_hItem,
			includes = needItems.includes(ent);

		if (m_hItem !== undefined && !includes) {
			
			if (listOfItems.IsInSelected(m_hItem.m_pAbilityData.m_pszAbilityName)) 
				needItems.push(ent);
				
		} else if (includes) {
			
			removedIDItem(ent)
		}
	}
}

Events.addListener("onNPCCreated", (npc: C_DOTA_BaseNPC) => npcs.push(npc))

function onEntityDestroyed(ent: C_BaseEntity, id: number) {
	
	if (ent instanceof C_DOTA_Item_Rune)
		return removedIDRune(ent as C_DOTA_Item_Rune);

	if (ent instanceof C_DOTA_Item_Physical)
		return removedIDItem(ent as C_DOTA_Item_Physical);

	if (ent instanceof C_DOTA_BaseNPC)
		return removedIDControllable(ent as C_DOTA_BaseNPC);
}

function onTick() {
	if (!IsInGame() || IsPaused())
		return
	// loop-optimizer: KEEP
	picking_up.forEach((rune, picker) => {
		if (!rune.m_bIsValid)
			delete picking_up[picker]
	})
	
	if (stateControllables.value)
		controllables = GetControllables();
	
	snatchRunes()
	snatchItems()
}

Events.addListener("onGameEnded", () => picking_up = [])

function onDraw() {
	if (!drawStatus.value || !IsInGame())
		return

	let text = ""

	// rune
	text += `${stateRune.name}: ${(stateRune.value || runeHoldKey.IsPressed) ? "On" : "Off"}`

	text += " | "

	// items
	text += `${stateItems.name}: ${(stateItems.value || itemsHoldKey.IsPressed) ? "On" : "Off"}`

	const wSize = Renderer.WindowSize

	Renderer.Text (
		wSize.x / 100 * statusPosX.value,
		wSize.y / 100 * statusPosY.value,
		text,
	)
}

function GetControllables() {
	return npcs.filter(npc =>
		(npc instanceof C_DOTA_BaseNPC_Hero || npc instanceof C_DOTA_Unit_SpiritBear)
		&& !npc.m_bIsIllusion
		&& !npc.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FAKE_ALLY)
		&& npc.IsControllableByPlayer(LocalDOTAPlayer.m_iPlayerID)
	)
}

// ------- Rune

function snatchRunes() {
	if (!stateRune.value && !runeHoldKey.IsPressed)
		return

	allRunes.forEach(rune => {
		let near = false

		if (stateControllables.value)
			near = orderBy(controllables, unit => unit.DistTo(rune)).some(npc => snatchRuneByUnit(npc, rune))
		else {
			if (LocalDOTAPlayer !== undefined)
				near = snatchRuneByUnit(LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC, rune)
		}

		if (!near && (drawParticleTake.value || drawParticleKill.value))
			destroyRuneParticles(rune.m_iID)
	})
}

function snatchRuneByUnit(npc: C_DOTA_BaseNPC, rune: C_DOTA_Item_Rune) {
	let npc_id = npc.m_iID
	if (picking_up[npc_id] !== undefined)
		return false

	if (!npc.m_bIsStunned && !npc.m_bIsWaitingToSpawn) {
		const distTo = npc.DistTo2D(rune)

		if (distTo <= takeRadius.value) {
			picking_up[npc_id] = rune
			PickupRune(npc, rune, false)
			return false
		}

		const attackRange = npc.m_fAttackRange

		if (distTo >= Math.max(500, attackRange) * 2)
			return false

		if (drawParticleTake.value || drawParticleKill.value) {
			const runeID = rune.m_iID

			if (allRunesParticles[runeID] === undefined) {
				allRunesParticles[runeID] = []

				if (drawParticleTake.value)
					createRuneParticle(rune, new Vector(0, 255), takeRadius.value)

				if (drawParticleKill.value)
					createRuneParticle(rune, new Vector(255, 0), attackRange)
			}

		}
	}
	return true
}

function removedIDRune(ent: C_DOTA_Item_Rune) {
	const idRune = allRunes.indexOf(ent)

	if (idRune !== -1) {
		allRunes.splice(idRune, 1)

		destroyRuneParticles(ent.m_iID)
	}
}

function removedIDItem(ent: C_DOTA_Item_Physical) {
	const idItem = needItems.indexOf(ent)

	if (idItem !== -1)
		needItems.splice(idItem, 1)
}

function removedIDControllable(ent: C_DOTA_BaseNPC) {
	const idNPC = npcs.indexOf(ent)

	if (idNPC !== -1)
		npcs.splice(idNPC, 1)
}

function createRuneParticle(ent: C_BaseEntity, color: Vector, radius: number) {
	const particleID = Particles.Create (
		"particles/ui_mouseactions/drag_selected_ring.vpcf",
		ParticleAttachment_t.PATTACH_ABSORIGIN,
		ent,
	)

	Particles.SetControlPoint(particleID, 1, color)
	Particles.SetControlPoint(particleID, 2, new Vector(radius * 1.1, 255))

	allRunesParticles[ent.m_iID].push(particleID)
}

function updateRuneAllParticle() {
	let newColor = new Vector(
		drawParticleTake_Color.R.value,
		drawParticleTake_Color.G.value,
		drawParticleTake_Color.B.value)

	for (var entID in allRunesParticles)
		Particles.SetControlPoint(allRunesParticles[entID][0], 1, newColor)
}

function destroyRuneParticles(runeID: number | string) {
	var particles = allRunesParticles[runeID] as number[]
	if (particles !== undefined) {
		particles.forEach(particleID =>
			Particles.Destroy(particleID, true))

		allRunesParticles[runeID] = undefined
	}
}

function destroyRuneAllParticles() {
	for (const entID in allRunesParticles)
		destroyRuneParticles(entID)

	allRunesParticles = []
}

// ------- Items

function snatchItems() {
	if ((!stateItems.value && !itemsHoldKey.IsPressed) || listOfItems.IsZeroSelected)
		return

	if (stateControllables.value)
		controllables.forEach(snatchItemByUnit)
	else {
		if (LocalDOTAPlayer !== undefined)
			snatchItemByUnit(LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC)
	}
}

function snatchItemByUnit(npc: C_DOTA_BaseNPC) {
	needItems.forEach(item => {
		if (npc.DistTo2D(item) <= takeRadius.value) {
			if (!haveFreeSlot(npc, item))
				return

			PickupItem(npc, item, false)
			return
		}
	})
}

function haveFreeSlot(npc: C_DOTA_BaseNPC, item: C_DOTA_Item_Physical) {
	let nameItem = item.m_hItem.m_pAbilityData.m_pszAbilityName,
		checkSlots = nameItem === "item_cheese" ? 9 : 6

	for (var i = checkSlots; i--; ) {
		if (npc.GetItemInSlot(i) === undefined)
			return true
	}
	return false
}

onStateMain()