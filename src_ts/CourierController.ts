import { Courier, Entity, EntityManager, EventsSDK, Game, Hero, LocalPlayer, Menu, Player, Unit, Team, GameSleeper } from "wrapper/Imports"

let allyCourier: Courier,
	Sleep: GameSleeper = new GameSleeper

let TOOLTIP_NEEDPLAYING = "Your need to playing match",
	TOOLTIP_ONPLAYING = "List of players for blocking courier(s)"

let courCtlrMenu = Menu.AddEntry(["Utility", "Courier Controller"]),
	State = courCtlrMenu.AddToggle("State"),
	// deliver
	deliverState = courCtlrMenu.AddToggle("Auto deliver"),
	antiReuseState = courCtlrMenu.AddToggle("Anti Reuse"),
	autoShieldState = courCtlrMenu.AddToggle("Auto Shield").SetTooltip("Auto use shield to try to save courier"),
	playersBlockList = courCtlrMenu.AddImageSelector("Players for block", []).SetTooltip(TOOLTIP_NEEDPLAYING)

function IsSpectator(): boolean {
	return LocalPlayer !== undefined && LocalPlayer.Team === Team.Observer
}
function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 250)
}
function UpdateMenu() {
	playersBlockList.values = EntityManager.AllEntities
		.filter(ent => ent instanceof Player && ent !== LocalPlayer && ent.HeroAssigned && !ent.IsEnemy())
		.map((pl: Player) => pl.Hero.Name)
	playersBlockList.Update()
}

let CastCourAbility = (num: number) => allyCourier.AbilitiesBook.GetSpell(num).UseAbility()

function CourierStateChanged(cour: Courier) {
	let stateCourEnt = cour.StateHero,
		stateCourEnum = cour.State
	if (checkCourSelf(stateCourEnt, stateCourEnum))
		return
	switch (stateCourEnum) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
			trySelfDeliver()
			Sleep.Sleep(GetDelayCast(), "OrderStop")
			break
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (!trySelfDeliver() || IsBlocked(stateCourEnt)) {
				CastCourAbility(0)
				Sleep.Sleep(GetDelayCast(), "OrderStop")
			}
			break
		default:
			break
	}
}

EventsSDK.on("Tick", () => {
	if (IsSpectator() || Sleep.Sleeping("OrderStop") || Sleep.Sleeping("Shield"))
		return
	if (allyCourier === undefined || !Game.IsInGame || Game.IsPaused || Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !State.value)
		return
	if (autoShieldState.value) {
		EntityManager.AllEntities.some(ent => {
			if (
				ent instanceof Unit
				&& ent.IsLaneCreep
				&& ent.HasAttackCapability()
				&& ent.IsEnemy(allyCourier)
				&& allyCourier.IsInRange(ent, ent.AttackRange, true)
			) {
				let shield = allyCourier.GetAbilityByName("courier_shield")
				if (shield !== undefined && shield.Level > 0 && shield.IsCooldownReady) {
					shield.UseAbility()
					Sleep.Sleep(GetDelayCast(), "Shield")
				}
				return true
			}
			return false
		})
	}
	CourierStateChanged(allyCourier)
})

function trySelfDeliver() {
	if (!deliverState.value)
		return false
	let localEnt = EntityManager.LocalHero
	if (localEnt === undefined || !localEnt.IsAlive || !localEnt.Inventory.HasFreeSlot(0, 9))
		return false
	let free_slots_local = localEnt.Inventory.GetFreeSlots(0, 8).length,
		cour_slots_local = allyCourier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = localEnt.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	if (items_in_stash > 0 && allyCourier.Inventory.GetFreeSlots(0, 8).length >= items_in_stash && free_slots_local >= items_in_stash + cour_slots_local) {
		CastCourAbility(7) // courier_take_stash_and_transfer_items
		Sleep.Sleep(GetDelayCast(), "OrderStop")
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		CastCourAbility(4) // courier_transfer_items
		Sleep.Sleep(GetDelayCast(), "OrderStop")
		return false
	}
	return false
}

function IsBlocked(npc: Hero) {
	if (antiReuseState.value)
		return true

	/*if (muteFilter.value && PlayerResource.PlayerTeamData[(npc.Owner as Player).PlayerID].m_bVoiceChatBanned)
		return true*/

	return playersBlockList.enabled_values.get(npc.Name)
}

function checkCourSelf(stateEnt: Hero, state: CourierState_t) {
	let localHero = EntityManager.LocalHero
	return localHero !== undefined && localHero === stateEnt
}

EventsSDK.on("GameStarted", () => {
	if (IsSpectator())
		return
	playersBlockList.SetTooltip(TOOLTIP_ONPLAYING)
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
})

EventsSDK.on("GameEnded", () => {
	allyCourier = undefined
	playersBlockList.SetTooltip(TOOLTIP_NEEDPLAYING)
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
	playersBlockList.values = []
	playersBlockList.Update()
})

EventsSDK.on("EntityCreated", (ent: Entity) => {
	if (ent instanceof Courier && allyCourier === undefined && ent.IsControllable)
		allyCourier = ent

	if (ent instanceof Hero)
		UpdateMenu()
})

EventsSDK.on("EntityDestroyed", ent => {
	if (allyCourier === ent)
		allyCourier = undefined
	if (ent instanceof Hero)
		UpdateMenu()
})
