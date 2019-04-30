import { MenuManager } from "../CrutchesSDK/Wrapper"
import { CastNoTarget } from "../Orders"

let registeredEvents = {
	onEntityCreated: undefined,
	onEntityDestroyed: undefined,
	onTick: undefined,
}

let allyCourier: C_DOTA_Unit_Courier,
	allAllyPlayers: C_DOTAPlayer[] = [],
	lastUsegeCour = 0

const TOOLTIP_NEEDPLAYING = "Your need to playing match"
const TOOLTIP_ONPLAYING = "List of players for blocking courier(s)"

// rename me
const courCtlrMenu = new MenuManager("Courier Controller JS")

const stateMain = courCtlrMenu.AddToggle("State")
	.OnValue(onStateMain)

// deliver
const deliverMenu = courCtlrMenu.AddTree("Deliver settings")

const deliverState = deliverMenu.AddToggle("Auto deliver")

const antiReuseState = deliverMenu.AddToggle("Anti Reuse")

// blocking
const blockCourMenu = courCtlrMenu.AddTree("Block settings")

/*
// need add to Native (Player.IsMuted)
const muteFilter = blockCourMenu.AddToggle("Mute filter")
	.SetToolTip("Blocking courier(s) for muted (voice) players");
*/

const playersBlockList = blockCourMenu.AddListBox("Players for block", [])
	.SetToolTip(TOOLTIP_NEEDPLAYING)

const rateTake = courCtlrMenu.AddSliderFloat("Rate of control", 1 / 30, 0.001, 1.0)
	.SetToolTip("Delay between taking courier. Above value - faster control")

// other
const autoShieldState = courCtlrMenu.AddToggle("Auto Shield")
	.SetToolTip("Auto use shield to safe")

let CastCourAbility = (num: number) => allyCourier
	&& CastNoTarget(allyCourier, allyCourier.GetAbility(num), false)

function onStateMain(state: boolean = stateMain.value) {
	if (!state)
		destroyEvents()
	else
		registerEvents()
}

Events.addListener("onGameStarted", lp => {

	lastUsegeCour = 0

	// loop-optimizer: POSSIBLE_UNDEFINED
	allAllyPlayers = Entities.GetAllEntities().filter(ent =>
		ent instanceof C_DOTAPlayer
		&& ent.m_iPlayerID !== lp.m_iPlayerID
		&& !ent.IsEnemy(LocalDOTAPlayer),
	) as C_DOTAPlayer[]

	playersBlockList.values = allAllyPlayers.map(hero =>
		PlayerResource.m_vecPlayerData[hero.m_iPlayerID].m_iszPlayerName
		+ ` (${(hero.m_hAssignedHero as C_DOTA_BaseNPC).m_iszUnitName})`)

	courCtlrMenu.Update()
	playersBlockList.SetToolTip(TOOLTIP_ONPLAYING)

	onStateMain()
})

Events.addListener("onGameEnded", () => {

	allAllyPlayers = []

	playersBlockList.SetToolTip(TOOLTIP_NEEDPLAYING)
	playersBlockList.selected_flags = []
	playersBlockList.values = []
	courCtlrMenu.Update()
})

function registerEvents() {
	registeredEvents.onEntityCreated = Events.addListener("onEntityCreated", onCheckEntity)
	registeredEvents.onEntityDestroyed = Events.addListener("onEntityDestroyed", onEntityDestroyed)
	registeredEvents.onTick = Events.addListener("onTick", onTick)
}

function destroyEvents() {
	Object.keys(registeredEvents).forEach(name => {
		let listenerID = registeredEvents[name]
		if (listenerID !== undefined) {
			Events.removeListener(name, listenerID)
			registeredEvents[name] = undefined
		}
	})
}

function onCheckEntity(ent: C_BaseEntity) {

	if (ent instanceof C_DOTA_Unit_Courier) {

		if (allyCourier === undefined)
			allyCourier = ent
	}
}

function onEntityDestroyed(ent: C_BaseEntity, id: number) {

	if (ent instanceof C_DOTA_Unit_Courier)
		return removedIDCour(ent as C_DOTA_Unit_Courier)
}

function removedIDCour(ent: C_DOTA_Unit_Courier) {

	if (allyCourier === ent)
		allyCourier = undefined
}

function onTick() {

	if (LocalDOTAPlayer === undefined
		|| !IsInGame()
		|| IsPaused()
		|| GameRules.m_iGameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO)
		return

	if (allyCourier === undefined) {
		// loop-optimizer: POSSIBLE_UNDEFINED
		Entities.GetAllEntities().forEach(onCheckEntity)

		if (allyCourier === undefined)
			return
	}

	if (autoShieldState.value) {

		// loop-optimizer: POSSIBLE_UNDEFINED
		Entities.GetAllEntities().forEach(ent => {

			if (
				ent instanceof C_DOTA_BaseNPC
				&& ent.m_bHasAttackCapability
				&& ent.IsEnemy(allyCourier)
				&& allyCourier.IsInRange(ent, ent.m_fAttackRange + ent.m_flHullRadius + allyCourier.m_flHullRadius)
			) {
				let shield = allyCourier.GetAbility(5) // "courier_shield"

				if (shield !== undefined && shield.m_iLevel > 0 && shield.m_fCooldown === 0)
					CastNoTarget(allyCourier, shield, false)
			}
		})

	}

	let gameTime = GameRules.m_fGameTime

	if (gameTime - rateTake.value < lastUsegeCour)
		return

	lastUsegeCour = gameTime

	let stateCourEnt = allyCourier.m_hCourierStateEntity as C_DOTA_BaseNPC_Hero

	if (stateCourEnt === LocalDOTAPlayer.m_hAssignedHero)
		return

	switch (allyCourier.m_nCourierState) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
			trySelfDeliver()
			break

		case CourierState_t.COURIER_STATE_MOVING:
			if (IsBlocked(stateCourEnt) && !trySelfDeliver())
				CastCourAbility(0) // courier_return_to_base
			break

		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (IsBlocked(stateCourEnt) && !trySelfDeliver())
				CastCourAbility(2) // courier_return_stash_items
			break

		default: break
	}
}

function trySelfDeliver() {

	if (!deliverState.value)
		return false

	let localEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero,
		delivery = false

	if (localEnt.m_bIsAlive && hasFreeSlot(localEnt)
		&& hasFreeSlot(allyCourier)) {

		if (hasItemsInInventory(allyCourier, localEnt)) {
			CastCourAbility(4) // courier_transfer_items
			delivery = true
		} else if (hasItemsInStash(localEnt)) {
			// CastCourAbility(3); // courier_take_stash_items
			SendToConsole("dota_courier_deliver") // because cast abil 3 spam "No Items To Be Delivered" at the base
			delivery = true
		}
	}

	return delivery
}

function hasItemsInInventory(npc: C_DOTA_BaseNPC, OwnerItem: C_DOTA_BaseNPC_Hero) {

	let items = npc.m_Inventory.m_hItems as C_DOTA_Item[]

	for (let i = 9; i--; ) {

		let item = items[i]

		if (item !== undefined && item.m_iPlayerOwnerID === OwnerItem.m_iPlayerID)
			return true
	}
	return false
}

function hasFreeSlot(npc: C_DOTA_BaseNPC) {

	let items = npc.m_Inventory.m_hItems as C_DOTA_Item[]

	for (let i = 9; i--; ) {
		if (items[i] === undefined)
			return true
	}
	return false
}

function hasItemsInStash(npc: C_DOTA_BaseNPC_Hero) {

	let items = npc.m_Inventory.m_hItems as C_DOTA_Item[]

	for (let i = 9; i < 15; i++) {
		if (items[i] !== undefined)
			return true
	}
	return false
}

function IsBlocked(npc: C_DOTA_BaseNPC_Hero) {

	if (antiReuseState.value)
		return true

	/* console.log(npc.m_iPlayerID);

	if (muteFilter.value && PlayerResource.m_vecPlayerTeamData[npc.m_iPlayerID].m_bVoiceChatBanned)
		return true;
	 */
	return playersBlockList.values.length > 0 && allAllyPlayers.some((player, index) =>
		player.m_hAssignedHero === npc && playersBlockList.selected_flags[index])
}
