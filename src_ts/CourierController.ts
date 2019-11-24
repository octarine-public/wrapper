import { Courier, EntityManager, EventsSDK, Game, Hero, LocalPlayer, Menu, Player, Unit, Vector3, Team, TickSleeper } from "wrapper/Imports"

let allyCourier: Courier,
	Sleep = new TickSleeper,
	unit_anim: Unit[] = [],
	Enemy: Hero[] = [],
	Owner: Hero,
	DELIVER_DISABLE = false

const CourierBestPosition = [new Vector3(6199.96875, 5822.375, 384), new Vector3(-6301.0625, -5868.59375, 384)]

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
const courCtlrMenu = Menu.AddEntry(["Utility", "Courier Controller"])
const State = courCtlrMenu.AddToggle("State")
const deliverState = courCtlrMenu.AddToggle("Auto deliver")
const antiReuseState = courCtlrMenu.AddToggle("Anti Reuse")
const autoShieldState = courCtlrMenu.AddToggle("Auto Shield").SetTooltip("Auto use shield to try to save courier")
const StateBestPos = courCtlrMenu.AddToggle("Courier best position", true)
const playersBlockList = courCtlrMenu.AddImageSelector("Players for block", [])

function UpdateMenu() {
	playersBlockList.values = EntityManager.AllEntities
		.filter(ent => ent instanceof Player && ent !== LocalPlayer && ent.HeroAssigned && !ent.IsEnemy())
		.map((pl: Player) => pl.Hero.Name)
	playersBlockList.Update()
}

function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 350)
}

function checkCourSelf(stateEnt: Hero) {
	return Owner !== undefined && Owner === stateEnt && Deliver()
}

let CastCourAbility = (num: number) => allyCourier.IsControllable && allyCourier.AbilitiesBook.GetSpell(num).UseAbility()

function CourierLogicBestPosition(enemy: Hero, StateCourier: Courier, Position: Vector3) {
	if (!enemy.IsEnemy() || !enemy.IsVisible) {
		return false
	}
	if (enemy.IsInRange(Position, (enemy.AttackRange + 250))) {
		if (StateCourier.State !== CourierState_t.COURIER_STATE_AT_BASE
			&& StateCourier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE
		) {
			CastCourAbility(0)
			DELIVER_DISABLE = true
			Sleep.Sleep(GetDelayCast())
			return false
		}
	} else if (!allyCourier.IsInRange(Position, 50)
		&& StateCourier.StateHero === undefined // if courier not busy (none control)
	) {
		if (StateCourier.State !== CourierState_t.COURIER_STATE_RETURNING_TO_BASE
		) {
			allyCourier.MoveTo(Position)
			DELIVER_DISABLE = false
			Sleep.Sleep(GetDelayCast())
			return true
		}
	}
}

function CourierBestPos() {
	if (!StateBestPos.value || Owner === undefined || !Owner.IsAlive) {
		return false
	}
	if (allyCourier === undefined || !allyCourier.IsControllable) {
		return false
	}
	let Position = Owner.Team === Team.Dire ? CourierBestPosition[0] : CourierBestPosition[1]
	return Enemy.some(enemy => {
		switch (allyCourier.State) {
			case CourierState_t.COURIER_STATE_IDLE:
			case CourierState_t.COURIER_STATE_AT_BASE:
			case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
				if (!CourierLogicBestPosition(enemy, allyCourier, Position)) {
					return false
				}
			case CourierState_t.COURIER_STATE_MOVING:
			case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
				if (enemy.IsEnemy() && enemy.IsVisible && enemy.IsInRange(Position, (enemy.AttackRange + 250))) {
					DELIVER_DISABLE = true
					CastCourAbility(0)
					Sleep.Sleep(GetDelayCast())
					return true
				}
				DELIVER_DISABLE = false
				return false
		}
	})
}
function CourierState(courier: Courier) {
	if (courier === undefined || courier.IsEnemy() || !courier.IsControllable) {
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
		case CourierState_t.COURIER_STATE_RETURNING_TO_BASE:
			if (!Deliver()) {
				return false
			}
			break
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (IsBlocked(StateCourEnt)) {
				CastCourAbility(0)
				return false
			}
			if (ItemsChecking() && antiReuseState.value) {
				CastCourAbility(4)
				Sleep.Sleep(GetDelayCast())
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
	Sleep.Sleep(GetDelayCast())
	return true
}

function ItemsChecking(): boolean {
	if (Owner === undefined || !Owner.IsAlive || !Owner.Inventory.HasFreeSlot(0, 9)) {
		return false
	}
	if (allyCourier === undefined || allyCourier.IsEnemy()) {
		return false
	}
	let free_slots_local = Owner.Inventory.GetFreeSlots(0, 8).length,
		cour_slots_local = allyCourier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = Owner.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)
	if (items_in_stash > 0 && allyCourier.Inventory.GetFreeSlots(0, 8).length >= items_in_stash && free_slots_local >= items_in_stash + cour_slots_local) {
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		return true
	}
	return false
}

function Deliver(): boolean {
	if (!deliverState.value || DELIVER_DISABLE) {
		return false
	}
	if (!Owner.IsAlive || !Owner.Inventory.HasFreeSlot(0, 9)) {
		return false
	}
	if (allyCourier === undefined || allyCourier.IsEnemy()) {
		return false
	}
	let free_slots_local = Owner.Inventory.GetFreeSlots(0, 8).length,
		cour_slots_local = allyCourier.IsControllable && allyCourier.Inventory.CountItemByOtherPlayer()
	let items_in_stash = Owner.Inventory.Stash.reduce((prev, cur) => prev + (cur !== undefined ? 1 : 0), 0)

	if (
		items_in_stash > 0
		&& allyCourier.IsControllable
		&& allyCourier.Inventory.GetFreeSlots(0, 8).length >= items_in_stash
		&& free_slots_local >= (items_in_stash + cour_slots_local)
	) {
		CastCourAbility(7) // courier_take_stash_and_transfer_items
		Sleep.Sleep(GetDelayCast())
		return true
	}
	if (cour_slots_local > 0 && free_slots_local >= cour_slots_local) {
		let StateCourEnum = allyCourier.State
		if (StateCourEnum !== CourierState_t.COURIER_STATE_DELIVERING_ITEMS) {
			CastCourAbility(4) // courier_transfer_items
			Sleep.Sleep(GetDelayCast())
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
	if (!State.value
		|| Owner === undefined
		|| allyCourier === undefined
		|| !allyCourier.IsAlive
		|| LocalPlayer.IsSpectator
		|| Sleep.Sleeping
	) {
		return
	}
	if (AutoShiled()) {
		return
	}
	if (CourierState(allyCourier)) {
		return
	}
	if (CourierBestPos()) {
		return
	}
})

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Courier && !ent.IsEnemy()) {
		allyCourier = ent
		if (State.value) {
			allyCourier.MoveTo(Owner !== undefined &&
				Owner.Team === Team.Dire
				? CourierBestPosition[0]
				: CourierBestPosition[1]
			)
		}
	}
	if (ent instanceof Hero) {
		UpdateMenu()
		Enemy.push(ent)
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

EventsSDK.on("GameStarted", (hero) => {
	if (Owner === undefined) {
		Owner = hero
	}
	if (playersBlockList.enabled_values.size <= 0) {
		return
	}
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
})

EventsSDK.on("GameEnded", () => {
	allyCourier = undefined
	Owner = undefined
	DELIVER_DISABLE = false
	unit_anim = []
	// loop-optimizer: KEEP
	playersBlockList.enabled_values.forEach((_, key) => playersBlockList.enabled_values.set(key, false))
	playersBlockList.values = []
	playersBlockList.Update()
})
EventsSDK.on("UnitAnimation", unit => {
	if (unit.IsEnemy()) {
		unit_anim.push(unit)
	}
})