import { Courier, EventsSDK, Game, Hero, LocalPlayer, Menu, Unit, Vector3, Team, TickSleeper, Ability } from "wrapper/Imports"

let allyCourier: Courier,
	Sleep = new TickSleeper,
	unit_anim: Unit[] = [],
	Enemy: Hero[] = [],
	Owner: Hero,
	DELIVER_DISABLE = false

const CourierBestPosition = [
	new Vector3(6199.96875, 5822.375, 384),
	new Vector3(-6301.0625, -5868.59375, 384)
]

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
const autoShieldState = courCtlrMenu.AddToggle("Auto Shield").SetTooltip("Auto use shield to try to save courier")
const StateBestPos = courCtlrMenu.AddToggle("Courier best position", true)

function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 350)
}

function checkCourSelf(stateEnt: Hero) {
	return Owner !== undefined && Owner === stateEnt && Deliver()
}

let CastCourAbility = (num: number) => allyCourier.IsControllable && allyCourier.AbilitiesBook.GetSpell(num).UseAbility()
function MoveCourier() {
	if (LocalPlayer === undefined)
		return
	let Team_ = LocalPlayer.Team === Team.Dire
	allyCourier.MoveTo(Team_ ? CourierBestPosition[0] : CourierBestPosition[1])
}
function CourierLogicBestPosition(enemy: Hero, StateCourier: Courier, Position: Vector3) {
	if (!enemy.IsEnemy() || !enemy.IsVisible) {
		return false
	}
	if (enemy.IsInRange(Position, (enemy.AttackRange + 350))) {
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
			MoveCourier()
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
	let Position = LocalPlayer !== undefined
		&& LocalPlayer.Team === Team.Dire
		? CourierBestPosition[0]
		: CourierBestPosition[1]
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
				if (enemy.IsEnemy() && enemy.IsVisible && enemy.IsInRange(Position, (enemy.AttackRange + 350))) {
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
		case CourierState_t.COURIER_STATE_MOVING:
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (!Deliver()) {
				return false
			}
			break
	}
	return false
}

function AbilityTypeReady(): Ability {
	return allyCourier.GetAbilityByName("courier_shield")
		?.IsCooldownReady
		? (!allyCourier.HasBuffByName("modifier_courier_burst")
			&& allyCourier.GetAbilityByName("courier_shield"))
		: (!allyCourier.HasBuffByName("modifier_courier_shield")
			&& allyCourier.GetAbilityByName("courier_burst"))
}

function AutoSafe(): boolean {
	if (!autoShieldState.value || allyCourier === undefined || unit_anim.length <= 0) {
		return false
	}
	let ability = AbilityTypeReady()
	if (ability === undefined || ability.Level === 0) {
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
	if (!attack_courier && unit_anim.length !== 0 || !ability.IsCooldownReady) {
		unit_anim = []
		return false
	}
	unit_anim = []
	if (ability.Name === "courier_burst") {
		CastCourAbility(0)
		ability.UseAbility()
	} else {
		ability.UseAbility()
	}
	Sleep.Sleep(GetDelayCast())
	return true
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
	if (AutoSafe()) {
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
		if (State.value && StateBestPos.value && LocalPlayer !== undefined) {
			setTimeout(MoveCourier, 1000);
		}
	}
	if (ent instanceof Hero) {
		Enemy.push(ent)
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (allyCourier === ent) {
		allyCourier = undefined
	}
})

EventsSDK.on("GameStarted", (hero) => {
	if (Owner === undefined) {
		Owner = hero
	}
})

EventsSDK.on("GameEnded", () => {
	allyCourier = undefined
	Owner = undefined
	DELIVER_DISABLE = false
	unit_anim = []
})

EventsSDK.on("UnitAnimation", unit => {
	if (unit.IsEnemy()) {
		unit_anim.push(unit)
	}
})