import { MenuManager, EventsSDK, Player, Courier, Entity, EntityManager, LocalPlayer, Unit, Hero, Game } from "wrapper/Imports";

//import * as Utils from "Utils"

let { MenuFactory } = MenuManager;

let allyCourier: Courier,
	allAllyPlayers: AllyPlayer[] = []

const TOOLTIP_NEEDPLAYING = "Your need to playing match"
const TOOLTIP_ONPLAYING = "List of players for blocking courier(s)"

// --- Menu

const courCtlrMenu = MenuFactory("Courier Controller")

const stateMain = courCtlrMenu.AddToggle("State");

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

	ent: Player
	indexInMenu: number

	constructor(ent: Player) {
		this.ent = ent

		this.UpdateMenu()
	}

	UpdateMenu() {
		if (!this.ent.HeroAssigned || this.indexInMenu !== undefined)
			return

		this.indexInMenu = playersBlockList.values.push(`${this.ent.Name} (${this.ent.Hero})`) - 1

		courCtlrMenu.Update()
	}
}

let CastCourAbility = (num: number) => allyCourier
	&& allyCourier.AbilitiesBook.GetSpell(num).UseAbility()

// --- Callbacks

EventsSDK.on("onGameStarted", () => playersBlockList.SetToolTip(TOOLTIP_ONPLAYING))

EventsSDK.on("onGameEnded", () => {

	allyCourier = undefined
	
	allAllyPlayers = []

	playersBlockList.SetToolTip(TOOLTIP_NEEDPLAYING)
	playersBlockList.selected_flags = []
	playersBlockList.values = []
	courCtlrMenu.Update()
})

// --- Methods

EventsSDK.on("onEntityCreated", (ent: Entity) => {

	if (
		ent instanceof Player
		&& (LocalPlayer === undefined
			|| (ent.PlayerID !== LocalPlayer.PlayerID && ent.IsAlly()))
	) {
		allAllyPlayers.push(new AllyPlayer(ent))
		return
	}

	if (ent instanceof Courier) {

		if (allyCourier === undefined && ent.IsAlly() && ent.IsControllable)
			allyCourier = ent

		return
	}

	if (ent instanceof Hero && !ent.IsIllusion) {
		let findPlayer = allAllyPlayers.find(player => player.ent.Hero === ent);
		if (findPlayer)
			findPlayer.UpdateMenu()
	}
})

EventsSDK.on("onEntityDestroyed", (ent: Entity) => {

	if (ent instanceof Courier && allyCourier === ent)
		allyCourier = undefined
})

EventsSDK.on("onUpdate", () => {

	if (!Game.IsInGame || !Game.IsPaused || Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO)
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
					shield.UseAbility();
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
			if (IsBlocked(stateCourEnt) && !trySelfDeliver())
				CastCourAbility(0) // courier_return_to_base
			break

		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (IsBlocked(stateCourEnt) && !trySelfDeliver())
				CastCourAbility(2) // courier_return_stash_items
			break

		default: break
	}
})


function checkCourSelf(stateEnt: Hero, state: CourierState_t) {

	let localHero = EntityManager.LocalHero

	if (localHero === undefined)
		return false

	let selfState = localHero === stateEnt;

	switch (state) {
		case CourierState_t.COURIER_STATE_MOVING: // ?
		case CourierState_t.COURIER_STATE_DELIVERING_ITEMS:
			if (allyCourier.IsFlying)
				selfState = selfState && (localHero.FindRotationAngle(allyCourier) < 0.2)
			break
	}
	return selfState
}

function trySelfDeliver() {

	if (!deliverState.value)
		return false

	let localEnt = EntityManager.LocalHero;

	if (localEnt === undefined || !localEnt.IsAlive || !localEnt.Inventory.HasFreeSlot(0, 9) || !allyCourier.Inventory.HasFreeSlot(0, 9))
		return false;

	if (allyCourier.Inventory.HasItemByOtherPlayer(localEnt)) {
		CastCourAbility(4) // courier_transfer_items
		return true
	} 
	else if (localEnt.Inventory.HasAnyItemStash) {
		CastCourAbility(7) // courier_take_stash_and_transfer_items
		return true
	}

	return false
}

function IsBlocked(npc: Hero) {

	if (antiReuseState.value)
		return true

	/*
	if (muteFilter.value && PlayerResource.m_vecPlayerTeamData[npc.m_iPlayerID].m_bVoiceChatBanned)
		return true;
	 */
	return playersBlockList.selected_flags.length > 0 && allAllyPlayers.some(player =>
		player.ent.Hero === npc && playersBlockList.selected_flags[player.indexInMenu])
}
