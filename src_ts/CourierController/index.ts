import { Courier, Entity, EntityManager, EventsSDK, Game, Hero, Menu, Player, Tree, ArrayExtensions, LocalPlayer, Unit } from "wrapper/Imports"
import ManagerBase from "./Base"

let allyCourier: Courier,
	allAllyPlayers: AllyPlayer[] = [],
	AllTree: Tree[] = []

let TOOLTIP_NEEDPLAYING = "Your need to playing match",
	TOOLTIP_ONPLAYING = "List of players for blocking courier(s)"

let courCtlrMenu = Menu.AddEntry(["Utility", "Courier Controller"]),
	State = courCtlrMenu.AddToggle("State"),
	// deliver
	deliverState = courCtlrMenu.AddToggle("Auto deliver"),
	antiReuseState = courCtlrMenu.AddToggle("Anti Reuse"),
	autoShieldState = courCtlrMenu.AddToggle("Auto Shield").SetTooltip("Auto use shield to try to save courier"),
	MuteSettings = courCtlrMenu.AddNode("Block Settings"),
	playersBlockList = MuteSettings.AddImageSelector("Players for block", []).SetTooltip(TOOLTIP_NEEDPLAYING)
	
let LocalPlayerManager = new ManagerBase;

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

EventsSDK.on("Tick", () => { 
	if (LocalPlayerManager.IsSpectator)
		return false
	if (!Game.IsInGame || Game.IsPaused || Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !State.value)
		return false
	if (allyCourier === undefined)
		return false
	if (autoShieldState.value) {
		EntityManager.AllEntities.forEach(ent => {
			if (
				ent instanceof Unit
				&& ent.IsLaneCreep
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
		return false
	switch (stateCourEnum) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
			trySelfDeliver()
		break
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (IsBlocked(stateCourEnt) && !trySelfDeliver()) {
				CastCourAbility(0)
			}
		break
		default: break
	}
})


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
		
	return playersBlockList.IsZeroSelected && allAllyPlayers.some(player =>
		player.ent.Hero === npc && playersBlockList.enabled_values.get(player.ent.Hero.Name))
}

function checkCourSelf(stateEnt: Hero, state: CourierState_t) {
	let localHero = EntityManager.LocalHero
	if (localHero === undefined || localHero !== stateEnt)
		return false
	return true
}

EventsSDK.on("GameStarted", () => {
	if (LocalPlayerManager.IsSpectator)
		return false
	playersBlockList.SetTooltip(TOOLTIP_ONPLAYING)
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
	playersBlockList.values = []
})

EventsSDK.on("GameEnded", () => {
	if (LocalPlayerManager.IsSpectator)
		return false
	allyCourier = undefined
	allAllyPlayers = []
	playersBlockList.SetTooltip(TOOLTIP_NEEDPLAYING)
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
	playersBlockList.values = []
	playersBlockList.Update()
})

EventsSDK.on("EntityCreated", (ent: Entity) => {
	if (LocalPlayerManager.IsSpectator)
		return false
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
	if (ent instanceof Tree)
		AllTree.push(ent)
})

EventsSDK.on("EntityDestroyed", (ent) => {
	if (LocalPlayerManager.IsSpectator)
		return false
	if (ent instanceof Courier)
		allyCourier = undefined
		
	if (ent instanceof Tree) {
		if (AllTree !== undefined)
			ArrayExtensions.arrayRemove(AllTree, ent)
	}
})


