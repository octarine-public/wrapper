import { CreateRGBTree, MenuManager } from "../CrutchesSDK/Wrapper"
import { PickupItem, PickupRune } from "../Orders"

let registedEvents = {
		onEntityCreated: undefined,
		onEntityDestroyed: undefined,
		onTick: undefined,
		onDraw: undefined,
	},
	allRunes: C_DOTA_Item_Rune[] = [],
	allRunesParticles = [],
	needItems: C_DOTA_Item_Physical[] = [],
	controllables: C_DOTA_BaseNPC[] = []

const snatcherMenu = new MenuManager("Snatcher")

const stateMain = snatcherMenu.AddToggle("State").OnValue(onStateMain)

// ----- Rune

const runeMenu = snatcherMenu.AddTree("Rune settings")

const stateRune = runeMenu.AddToggle("Snatch Rune")
	.OnDeactivate(onDiactivateRune);

const runeToggle = runeMenu.AddKeybind("Rune toogle")
	.OnRelease(() => stateRune.ChangeReverse());

const runeHoldKey = runeMenu.AddKeybind("Rune hold key")
	.OnRelease(() => {
		if (!stateRune.value)
			onDiactivateRune()
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
	.OnDeactivate(onDiactivateItems)

const itemsToggle = itemsMenu.AddKeybind("Items toogle")
	.OnRelease(() => stateItems.ChangeReverse())

const itemsHoldKey = itemsMenu.AddKeybind("Items hold key")
	.OnRelease(() => {
		if (!stateItems.value)
			onDiactivateItems()
	})

const takeRadius = snatcherMenu.AddSlider("Pickup radius", 150, 50, 500, "Default range is 150, that one don't require rotating unit to pickup something")

const listOfItems = itemsMenu.AddListBox("Items for snatch",
	["item_gem", "item_cheese", "item_rapier", "item_aegis"],
	[true, true, true, true])

const stateControllables = snatcherMenu.AddToggle("Use other units")
	.OnDeactivate(onDiactivateControllables)

// ----- Draw

const drawMenu = snatcherMenu.AddTree("Draw")
const drawStatus = drawMenu.AddToggle("Draw status"),
	statusPosX = drawMenu.AddSlider("Position X (%)", 0, 0, 100),
	statusPosY = drawMenu.AddSlider("Position Y (%)", 75, 0, 100)

function onStateMain(state: boolean = stateMain.value) {
	if (!state) {
		destroyEvents()

		onDiactivateRune()
		onDiactivateItems()
		onDiactivateControllables()
	} else
		registerEvents()
}

function onDiactivateRune() {
	destroyRuneAllParticles()
	allRunes = []
}

function onDiactivateItems() {
	needItems = []
}

function onDiactivateControllables() {
	controllables = []
}

Events.addListener("onGameStarted", onStateMain);
Events.addListener("onGameEnded", onStateMain);

function registerEvents() {
	registedEvents.onEntityCreated = Events.addListener("onEntityCreated", onCheckEntity)
	registedEvents.onEntityDestroyed = Events.addListener("onEntityDestroyed", onEntityDestroyed)
	registedEvents.onTick = Events.addListener("onTick", onTick)
	registedEvents.onDraw = Events.addListener("onDraw", onDraw)
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
	if (!ent.m_bIsValid)
		return

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

	if (ent instanceof C_DOTA_BaseNPC && stateControllables.value) {
		
		if (LocalDOTAPlayer !== undefined
			&& ent.m_iUnitType !== 0
			&& !ent.m_bIsIllusion
			&& !ent.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FAKE_ALLY)
			&& ent.IsControllableByPlayer(LocalDOTAPlayer.m_iPlayerID)
			&& (ent.m_bIsHero || ent instanceof C_DOTA_Unit_SpiritBear)
			&& !controllables.includes(ent)
		)
		controllables.push(ent)
	}
}

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

	// loop-optimizer: POSSIBLE_UNDEFINED
	Entities.GetAllEntities().forEach(onCheckEntity)

	snatchRunes()
	snatchItems()
}

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

function checkValidUnit(npc: C_DOTA_BaseNPC) {
	if (npc === undefined || !npc.m_bIsValid || !npc.m_bIsAlive || !npc.IsControllableByPlayer(LocalDOTAPlayer.m_iPlayerID)) {
		if (LocalDOTAPlayer.m_hAssignedHero !== npc)
			removedIDControllable(npc)
		return false
	}
	return true
}

// ------- Rune

function snatchRunes() {
	if (!stateRune.value && !runeHoldKey.IsPressed)
		return

	allRunes.forEach(rune => {
		let near = false

		if (stateControllables.value)
			near = controllables.filter(npc => snatchRuneByUnit(npc, rune)).length > 0
		else {
			if (LocalDOTAPlayer !== undefined)
				near = snatchRuneByUnit(LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC, rune)
		}

		if (!near && (drawParticleTake.value || drawParticleKill.value))
			destroyRuneParticles(rune.m_iID)
	})
}

function snatchRuneByUnit(npc: C_DOTA_BaseNPC, rune: C_DOTA_Item_Rune) {
	if (!checkValidUnit(npc))
		return

	if (!npc.m_bIsStunned && !npc.m_bIsWaitingToSpawn) {
		const distTo = npc.DistTo(rune)

		if (distTo <= takeRadius.value) {
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
	const idNPC = controllables.indexOf(ent)

	if (idNPC !== -1)
		controllables.splice(idNPC, 1)
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
		if (npc.DistTo(item) <= takeRadius.value) {

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