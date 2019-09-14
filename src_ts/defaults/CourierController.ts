import { Courier, Entity, EntityManager, EventsSDK, Game, Hero, LocalPlayer, Menu, Player, Unit } from "wrapper/Imports"

// import * as Utils from "Utils"

let allyCourier: Courier,
	allAllyPlayers: AllyPlayer[] = []

const TOOLTIP_NEEDPLAYING = "Your need to playing match"
const TOOLTIP_ONPLAYING = "List of players for blocking courier(s)"

// --- Menu

const courCtlrMenu = Menu.AddEntry(["Utility", "Courier Controller"])

const stateMain = courCtlrMenu.AddToggle("State")

// deliver
const deliverState = courCtlrMenu.AddToggle("Auto deliver")

const antiReuseState = courCtlrMenu.AddToggle("Anti Reuse")

// blocking
/*
// need add to Native (Player.IsMuted)
const muteFilter = blockCourMenu.AddToggle("Mute filter")
	.SetTooltip("Blocking courier(s) for muted (voice) players");
*/

const playersBlockList = courCtlrMenu.AddImageSelector("Players for block", [])
	.SetTooltip(TOOLTIP_NEEDPLAYING)

// other
const autoShieldState = courCtlrMenu.AddToggle("Auto Shield")
	.SetTooltip("Auto use shield to try to save courier")

class AllyPlayer {
	ent: Player
	indexInMenu: number

	constructor(ent: Player) {
		this.ent = ent

		this.UpdateMenu()
	}

	UpdateMenu() {
		if (!this.ent.HeroAssigned || this.indexInMenu !== undefined)
			return

		this.indexInMenu = playersBlockList.values.push(`${this.ent.Hero}`) - 1

		playersBlockList.Update()
	}
}

let CastCourAbility = (num: number) => allyCourier
	&& allyCourier.AbilitiesBook.GetSpell(num).UseAbility()

// --- Callbacks

EventsSDK.on("GameStarted", () => {
	playersBlockList.SetTooltip(TOOLTIP_ONPLAYING)
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key,false))
	playersBlockList.values = []
})

EventsSDK.on("GameEnded", () => {
	allyCourier = undefined

	allAllyPlayers = []

	playersBlockList.SetTooltip(TOOLTIP_NEEDPLAYING)
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
	playersBlockList.values = []
	playersBlockList.Update()
})

// --- Methods

EventsSDK.on("EntityCreated", (ent: Entity) => {
	if (
		ent instanceof Player
		&& (LocalPlayer === undefined
			|| (ent.PlayerID !== LocalPlayer.PlayerID && !ent.IsEnemy()))
	) {
		allAllyPlayers.push(new AllyPlayer(ent))
		return
	}

	if (ent instanceof Courier) {
		if (allyCourier === undefined && !ent.IsEnemy() && ent.IsControllable) {
			allyCourier = ent
		}
		return
	}

	if (ent instanceof Hero && !ent.IsIllusion) {
		let findPlayer = allAllyPlayers.find(player => player.ent.Hero === ent)
		if (findPlayer)
			findPlayer.UpdateMenu()
	}
})

EventsSDK.on("EntityDestroyed", (ent: Entity) => {
	if (ent instanceof Courier && allyCourier === ent)
		allyCourier = undefined
})

EventsSDK.on("Update", () => {
	if (!Game.IsInGame || Game.IsPaused || Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !stateMain.value)
		return
	if (allyCourier === undefined)
		return

	if (autoShieldState.value) {
		EntityManager.AllEntities.forEach(ent => {
			if (
				ent instanceof Unit
				&& ent.HasAttackCapability()
				&& ent.IsEnemy(allyCourier)
				&& allyCourier.IsInRange(ent, ent.AttackRange, true)
			) {
				let shield = allyCourier.AbilitiesBook.GetSpell(5) // "courier_shield"

				if (shield !== undefined && shield.Level > 0 && shield.IsCooldownReady)
					shield.UseAbility()
			}
		})

	}
	let stateCourEnt = allyCourier.StateHero,
		stateCourEnum = allyCourier.State

	if (checkCourSelf(stateCourEnt, stateCourEnum))
		return
	switch (stateCourEnum) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
			trySelfDeliver()
			break

		case CourierState_t.COURIER_STATE_MOVING:
			if (IsBlocked(stateCourEnt) && trySelfDeliver())
				CastCourAbility(0) // courier_return_to_base
			break

		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (IsBlocked(stateCourEnt) && trySelfDeliver())
				CastCourAbility(2) // courier_return_stash_items
			break

		default: break
	}
})

function checkCourSelf(stateEnt: Hero, state: CourierState_t) {
	let localHero = EntityManager.LocalHero

	if (localHero === undefined || localHero !== stateEnt)
		return false

	/*switch (state) {
		case CourierState_t.COURIER_STATE_MOVING: // ?
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (allyCourier.IsFlying)
				return localHero.FindRotationAngle(allyCourier) < 0.2
			break
		default:
			break
	}*/
	return true
}

function trySelfDeliver() {
	if (!deliverState.value)
		return false

	let localEnt = EntityManager.LocalHero

	if (localEnt === undefined || !localEnt.IsAlive || !localEnt.Inventory.HasFreeSlot(0, 9))
		return false

	let free_slots_local = localEnt.Inventory.GetFreeSlots(0, 8).length,
		cour_slots_local = allyCourier.Inventory.CountItemByOtherPlayer(localEnt)
	let items_in_stash = localEnt.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	if (items_in_stash > 0 && allyCourier.Inventory.GetFreeSlots(0, 8).length >= items_in_stash && free_slots_local >= items_in_stash + cour_slots_local) {
		CastCourAbility(7) // courier_take_stash_and_transfer_items
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		CastCourAbility(4) // courier_transfer_items
		return false
	}

	return false
}

function IsBlocked(npc: Hero) {
	if (antiReuseState.value)
		return true

	/*if (muteFilter.value && PlayerResource.PlayerTeamData[(npc.Owner as Player).PlayerID].m_bVoiceChatBanned)
		return true*/
	return !playersBlockList.IsZeroSelected && allAllyPlayers.some(player =>
		player.ent.Hero === npc && playersBlockList.enabled_values.get(player.ent.Name))
}
