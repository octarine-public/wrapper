import * as Utils from "Utils"

import { MenuFactory } from "../CrutchesSDK/Wrapper"
import { CastNoTarget } from "../Orders"

let registeredEvents = {
	onEntityCreated: undefined,
	onEntityDestroyed: undefined,
	onUpdate: undefined,
}

let allyCourier: C_DOTA_Unit_Courier,
	allAllyPlayers: AllyPlayer[] = []

const TOOLTIP_NEEDPLAYING = "Your need to playing match"
const TOOLTIP_ONPLAYING = "List of players for blocking courier(s)"

// --- Menu

// rename me
const courCtlrMenu = MenuFactory("Courier Controller")

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

// other
const autoShieldState = courCtlrMenu.AddToggle("Auto Shield")
	.SetToolTip("Auto use shield to safe")

class AllyPlayer {

	ent: C_DOTAPlayer
	indexInMenu: number

	constructor(ent: C_DOTAPlayer) {
		this.ent = ent

		this.UpdateMenu()
	}

	UpdateMenu() {
		if (!this.ent.m_bHeroAssigned)
			return

		let plToMenu = PlayerResource.m_vecPlayerData[this.ent.m_iPlayerID].m_iszPlayerName
			+ ` (${(this.ent.m_hAssignedHero as C_DOTA_BaseNPC).m_iszUnitName})`

		this.indexInMenu = playersBlockList.values.push(plToMenu) - 1

		courCtlrMenu.Update()
	}
}

let CastCourAbility = (num: number) => allyCourier
	&& CastNoTarget(allyCourier, Utils.GetAbilityBySlot(allyCourier, num), false)

function onStateMain(state: boolean = stateMain.value) {
	if (!state)
		destroyEvents()
	else
		registerEvents()
}

// --- Callbacks

Events.on("onGameStarted", lp => {

	playersBlockList.SetToolTip(TOOLTIP_ONPLAYING)

	onStateMain()
})

Events.on("onGameEnded", () => {

	onStateMain(false)

	allAllyPlayers = []

	playersBlockList.SetToolTip(TOOLTIP_NEEDPLAYING)
	playersBlockList.selected_flags = []
	playersBlockList.values = []
	courCtlrMenu.Update()
})

// --- Methods

function registerEvents() {
	registeredEvents.onEntityCreated = Events.on("onEntityCreated", onCheckEntity)
	registeredEvents.onEntityDestroyed = Events.on("onEntityDestroyed", onEntityDestroyed)
	registeredEvents.onUpdate = Events.on("onUpdate", onUpdate)

	// loop-optimizer: POSSIBLE_UNDEFINED
	Entities.AllEntities.forEach(onCheckEntity)
}

function destroyEvents() {

	Object.keys(registeredEvents).forEach(name => {
		let listenerID = registeredEvents[name]
		if (listenerID !== undefined) {
			Events.removeListener(name, listenerID)
			registeredEvents[name] = undefined
		}
	})

	allyCourier = undefined
}

function onCheckEntity(ent: C_BaseEntity) {

	if (
		ent instanceof C_DOTAPlayer
		&& (LocalDOTAPlayer === undefined
			|| (ent.m_iPlayerID !== LocalDOTAPlayer.m_iPlayerID
			&& !Utils.IsEnemy(ent, LocalDOTAPlayer)))
	) {
		allAllyPlayers.push(new AllyPlayer(ent))
		return
	}

	if (ent instanceof C_DOTA_Unit_Courier) {

		if (allyCourier === undefined)
			allyCourier = ent

		return
	}

	if (ent instanceof C_DOTA_BaseNPC
		&& Utils.IsHero(ent)
		&& Utils.IsControllableByAnyPlayer(ent)
	) {
		let findPlayer = allAllyPlayers.find(player => player.ent.m_hAssignedHero === ent)
		if (findPlayer)
			findPlayer.UpdateMenu()
	}
}

function onEntityDestroyed(ent: C_BaseEntity, id: number) {

	if (ent instanceof C_DOTA_Unit_Courier)
		removedIDCour(ent as C_DOTA_Unit_Courier)
}

function removedIDCour(ent: C_DOTA_Unit_Courier) {

	if (allyCourier === ent)
		allyCourier = undefined
}

function onUpdate() {

	if (!IsInGame()
		|| GameRules.m_bGamePaused
		|| GameRules.m_iGameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO)
		return

	if (allyCourier === undefined)
		return

	if (autoShieldState.value) {

		// loop-optimizer: POSSIBLE_UNDEFINED
		Entities.AllEntities.forEach(ent => {

			if (
				ent instanceof C_DOTA_BaseNPC
				&& Utils.HasAttackCapability(ent)
				&& Utils.IsEnemy(ent, allyCourier)
				&& Utils.IsInRange(allyCourier, ent, ent.m_fAttackRange + ent.m_flHullRadius + allyCourier.m_flHullRadius)
			) {
				let shield = Utils.GetAbilityBySlot(allyCourier, 5) // "courier_shield"

				if (shield !== undefined && shield.m_iLevel > 0 && shield.m_fCooldown === 0)
					CastNoTarget(allyCourier, shield, false)
			}
		})

	}
	let stateCourEnt = allyCourier.m_hCourierStateEntity as C_DOTA_BaseNPC_Hero,
		stateCourEnum = allyCourier.m_nCourierState

	if (checkCourSelf(stateCourEnt, stateCourEnum))
		return

	switch (stateCourEnum) {
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

function checkCourSelf(stateEnt: C_DOTA_BaseNPC_Hero, state: CourierState_t) {

	if (LocalDOTAPlayer === undefined)
		return false

	let localHero = LocalDOTAPlayer.m_hAssignedHero,
		selfState = stateEnt === localHero

	switch (state) {
		case CourierState_t.COURIER_STATE_MOVING: // ?
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (allyCourier.m_bFlyingCourier)
				selfState = selfState && (localHero.m_vecNetworkOrigin.FindRotationAngle(allyCourier) < 0.2)
			break
	}
	return selfState
}

function trySelfDeliver() {

	if (!deliverState.value || LocalDOTAPlayer === undefined)
		return false

	let localEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero,
		delivery = false

	if (Utils.IsAlive(localEnt) && hasFreeSlot(localEnt)
		&& hasFreeSlot(allyCourier)) {

		if (hasItemsInInventory(allyCourier, localEnt)) {
			CastCourAbility(4) // courier_transfer_items
			delivery = true
		} else if (hasItemsInStash(localEnt)) {
			CastCourAbility(7)
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

	/*
	if (muteFilter.value && PlayerResource.m_vecPlayerTeamData[npc.m_iPlayerID].m_bVoiceChatBanned)
		return true;
	 */
	return playersBlockList.selected_flags.length > 0 && allAllyPlayers.some(player =>
		player.ent.m_hAssignedHero === npc && playersBlockList.selected_flags[player.indexInMenu])
}
