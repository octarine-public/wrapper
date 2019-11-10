import { Courier, EntityManager, EventsSDK, Game, GameSleeper, Hero, LocalPlayer, Menu, Player, Unit } from "wrapper/Imports"

let allyCourier: Courier,
	Sleep = new GameSleeper(),
	unit_anim: Unit[] = []
// use ability courier
const per_ability_kill: string[] = [
	"axe_culling_blade",
	"bane_brain_sap",
	"bane_fiends_grip",
	"lina_laguna_blade",
	"magnataur_reverse_polarity",
	"beastmaster_primal_roar",
	"pudge_dismember",
	"spirit_breaker_nether_strike",
	"batrider_flaming_lasso",
	"viper_viper_strike",
	"shadow_demon_demonic_purge"
]
let courCtlrMenu = Menu.AddEntry(["Utility", "Courier Controller"]),
	State = courCtlrMenu.AddToggle("State"),
	// deliver
	deliverState = courCtlrMenu.AddToggle("Auto deliver"),
	antiReuseState = courCtlrMenu.AddToggle("Anti Reuse"),
	autoShieldState = courCtlrMenu.AddToggle("Auto Shield").SetTooltip("Auto use shield to try to save courier"),
	playersBlockList = courCtlrMenu.AddImageSelector("Players for block", [])

function UpdateMenu() {
	playersBlockList.values = EntityManager.AllEntities
		.filter(ent => ent instanceof Player && ent !== LocalPlayer && ent.HeroAssigned && !ent.IsEnemy())
		.map((pl: Player) => pl.Hero.Name)
	playersBlockList.Update()
}

function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 250)
}

function checkCourSelf(stateEnt: Hero) {
	let localHero = EntityManager.LocalHero
	return localHero !== undefined && localHero === stateEnt && Deliver()
}

let CastCourAbility = (num: number) => allyCourier.IsControllable && allyCourier.AbilitiesBook.GetSpell(num).UseAbility()

function CourierState(courier: Courier) {
	if (courier === undefined || !courier.IsControllable) {
		return false
	}
	let StateCourEnt = courier.StateHero,
		StateCourEnum = courier.State
	if (checkCourSelf(StateCourEnt)) {
		return false
	}
	switch (StateCourEnum) {
		case CourierState_t.COURIER_STATE_IDLE:
		case CourierState_t.COURIER_STATE_AT_BASE:
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE: Deliver(); break
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (IsBlocked(StateCourEnt)) {
				CastCourAbility(0)
				return false
			}
			if (ItemsChecking() && antiReuseState.value) {
				CastCourAbility(4)
				Sleep.Sleep(GetDelayCast(), "OrderStop")
				return true
			}
			break
	}
	return false
}

function AutoShiled(): boolean {
	//console.log(unit_anim.toString())
	if (!autoShieldState.value || allyCourier === undefined || unit_anim.length <= 0) {
		return false
	}
	let shield = allyCourier.GetAbilityByName("courier_shield")
	if (shield === undefined || shield.Level === 0) {
		return false
	}
	let attack_courier = unit_anim.some(unit =>
		per_ability_kill.some(abil => unit.GetAbilityByName(abil) !== undefined
			&& unit.IsInRange(allyCourier, unit.GetAbilityByName(abil).CastRange)
			&& !unit.GetAbilityByName(abil).IsInAbilityPhase
		) ||
		(
			unit.IsInRange(allyCourier, (unit.AttackRange + unit.HullRadius))
			&& unit.AttackDamage(allyCourier, true) > allyCourier.HP
		)
	)
	//console.log(attack_courier)
	if (!attack_courier && unit_anim.length !== 0 || !shield.IsCooldownReady) {
		unit_anim = []
		return false
	}
	unit_anim = []
	shield.UseAbility()
	Sleep.Sleep(GetDelayCast(), "Shield")
	return true
}

function ItemsChecking(): boolean {
	let localEnt = EntityManager.LocalHero
	if (localEnt === undefined || !localEnt.IsAlive || !localEnt.Inventory.HasFreeSlot(0, 9))
		return false
	let free_slots_local = localEnt.Inventory.GetFreeSlots(0, 8).length,
		cour_slots_local = allyCourier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = localEnt.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	if (items_in_stash > 0 && allyCourier.Inventory.GetFreeSlots(0, 8).length >= items_in_stash && free_slots_local >= items_in_stash + cour_slots_local) {
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		return true
	}
	return false
}

function Deliver(): boolean {
	if (!deliverState.value)
		return false
	let localEnt = EntityManager.LocalHero
	if (localEnt === undefined || !localEnt.IsAlive || !localEnt.Inventory.HasFreeSlot(0, 9)) {
		return false
	}
	let free_slots_local = localEnt.Inventory.GetFreeSlots(0, 8).length,
		cour_slots_local = allyCourier.IsControllable && allyCourier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = localEnt.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	if (
		items_in_stash > 0
		&& allyCourier.IsControllable
		&& allyCourier.Inventory.GetFreeSlots(0, 8).length >= items_in_stash
		&& free_slots_local >= (items_in_stash + cour_slots_local)
	) {
		CastCourAbility(7) // courier_take_stash_and_transfer_items
		Sleep.Sleep(GetDelayCast(), "OrderStop")
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		let StateCourEnum = allyCourier.State
		if (StateCourEnum !== CourierState_t.COURIER_STATE_DELIVERING_ITEMS) {
			CastCourAbility(4) // courier_transfer_items
			Sleep.Sleep(GetDelayCast(), "OrderStop")
			return true
		}
	}
	return false
}

function IsBlocked(npc: Hero) {
	if (npc === undefined) {
		return false
	}
	return playersBlockList.enabled_values.get(npc.Name)
}

EventsSDK.on("Tick", () => {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || !State.value || Sleep.Sleeping("OrderStop") || Sleep.Sleeping("Shield")) {
		return false
	}
	if (AutoShiled()) {
		return true
	}
	if (CourierState(allyCourier)) {
		return true
	}
})

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Courier) {
		allyCourier = ent
	}
	if (ent instanceof Hero) {
		UpdateMenu()
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (allyCourier === ent) {
		allyCourier = undefined
	}
	if (ent instanceof Hero) {
		UpdateMenu()
	}
})

EventsSDK.on("GameStarted", () => {
	if (playersBlockList.enabled_values.size <= 0) {
		return
	}
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
})

EventsSDK.on("GameEnded", () => {
	allyCourier = undefined
	unit_anim = []
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
	playersBlockList.values = []
	playersBlockList.Update()
})
EventsSDK.on("UnitAnimation", (unit) => {
	if (unit.IsEnemy()) {
		unit_anim.push(unit)
	}
})