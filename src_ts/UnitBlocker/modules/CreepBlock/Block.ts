import { ArrayExtensions, Creep, Game, GameSleeper, LocalPlayer, Menu, RendererSDK, Unit, Tower, EntityManager } from "wrapper/Imports"
import { stateMain } from "../../base/MenuBase"

import {
	baseCheckUnit,
	Controllables,
	getCenterDirection,
	MoveUnit,
} from "../Controllables"

import {
	CenterCamera,
	CountUnits,
	DrawHelpPosition,
	DrawState,
	GoToBestPosition,
	Key,

	KeyStyle,
	Sensitivity,
	SkipRange,

	State,
	StateUnits,
	StatusAroundUnits,
	StatusMouse,
} from "./Menu"

import { BestPosition, DrawParticles, RemoveParticles } from "./ParticleHelp"

let sleeper = new GameSleeper()

let SwitchParticles = (caller: Menu.Toggle) => caller.value ? DrawParticles() : RemoveParticles()
let turnStateBlock: boolean = false
let ControllablesUnitsDraw = new Map<Unit, string>()

State.OnValue(SwitchParticles)
DrawState.OnValue(SwitchParticles)
DrawHelpPosition.OnValue(SwitchParticles)
stateMain.OnValue(SwitchParticles)

CountUnits.OnValue(() => ControllablesUnitsDraw.clear())

Key.OnPressed(() => {
	turnStateBlock = !turnStateBlock

	if (!turnStateBlock)
		ControllablesUnitsDraw.clear()

	if (KeyStyle.selected_id === 1)
		Game.ExecuteCommand((turnStateBlock ? "+" : "-") + "dota_camera_center_on_hero")
})

Key.OnValue(caller => {
	let isPressed = caller.is_pressed
	if (!CenterCamera.value || StateUnits.selected_id !== 0 || KeyStyle.selected_id !== 0)
		return

	Game.ExecuteCommand((isPressed ? "+" : "-") + "dota_camera_center_on_hero")

	if (!isPressed)
		ControllablesUnitsDraw.clear()
})

export function GameEnded() {
	turnStateBlock = false
	sleeper.FullReset()
	ControllablesUnitsDraw.clear()
}

export function Update() {
	if (!State.value || sleeper.Sleeping("tick"))
		return

	if ((KeyStyle.selected_id === 1 && !turnStateBlock) ||
		(KeyStyle.selected_id === 0 && !Key.is_pressed))
		return

	let countUnits = 0

	switch (StateUnits.selected_id) {
		case 0: { // local
			let localHero = LocalPlayer?.Hero
			if (localHero === undefined || !baseCheckUnit(localHero))
				return

			let command = ControllablesUnitsDraw.get(localHero)

			if (command === undefined)
				ControllablesUnitsDraw.set(localHero, "Waiting Creeps")

			let creeps = GetCreeps(localHero)

			if (creeps.length === 0) {
				if (GoToBestPosition.value && GoingToBestPosition(localHero))
					return

				ControllablesUnitsDraw.set(localHero, "Waiting Creeps")
				return
			}

			Stopping(localHero, creeps)
			countUnits = 1
			break
		}
		case 1: {
			let controllables = Controllables()

			if (controllables.length === 0)
				return

			let localHero = LocalPlayer?.Hero

			if (localHero !== undefined && baseCheckUnit(localHero))
				ArrayExtensions.arrayRemove(controllables, localHero)

			countUnits += PreparingUnits(controllables) || 0
			break
		}
		// case 1: PreparingUnits(SelectedStopping()); break;
		case 2:
			countUnits += PreparingUnits(Controllables())
			break
		default:
			break
	}

	sleeper.Sleep(countUnits * 25, "tick")
}

export function Draw(): string | undefined {
	if (!State.value || !DrawState.value)
		return

	if ((KeyStyle.selected_id === 1 && !turnStateBlock) ||
		(KeyStyle.selected_id === 0 && !Key.is_pressed))
		return

	if (StatusAroundUnits.value) {
		// loop-optimizer: KEEP
		ControllablesUnitsDraw.forEach((text, unit) => {

			let wts = RendererSDK.WorldToScreen(unit.Position)

			if (wts !== undefined)
				RendererSDK.Text(text, wts)
		})
	}

	return StatusMouse.value ? "CreepBlock: ON" : undefined
}

function GetCreeps(unit?: Unit): Creep[] {
	return EntityManager.GetEntitiesByClass(Creep).filter(creep => {
		if (!creep.IsLaneCreep || creep.IsEnemy())
			return false
		if (SkipRange.value && creep.IsRangeAttacker)
			return false

		if (unit !== undefined && !creep.IsInRange(unit, 500))
			return false

		return !creep.IsControllable && !creep.IsWaitingToSpawn && creep.IsAlive
	})
}

function GetGroupsCreeps() {
	let groups: Creep[][] = []

	let creeps = GetCreeps()

	creeps.forEach(creep => {
		let group = creeps.filter(creepNear => creep.IsInRange(creepNear, 500)
			&& !groups.some(group_ => group_.some(creep_ => creep_ === creep)))

		if (group.length > 0)
			groups.push(group)
	})

	return groups
}

function CheckTowerNear(unit: Unit): boolean {
	return EntityManager.GetEntitiesByClass(Tower).some(tower =>
		tower.IsAlive
		&& tower.Name === "npc_dota_badguys_tower2_mid"
		&& tower.IsInRange(unit, 200)
	)
}

function GoingToBestPosition(unit: Unit): boolean {
	let closest = unit.Position.Closest(BestPosition[unit.Team - 2])

	if (unit.IsInRange(closest, 100))
		return false

	MoveUnit(unit, closest)
	ControllablesUnitsDraw.set(unit, "Moving to the best position")

	return true
}

function PreparingUnits(controllables: Unit[]) {

	if (controllables.length === 0)
		return 0

	controllables.splice(CountUnits.value)

	let groups = GetGroupsCreeps()

	controllables.forEach(unit => {
		let command = ControllablesUnitsDraw.get(unit)

		if (command === undefined)
			ControllablesUnitsDraw.set(unit, "Waiting Creeps")

		if (GoToBestPosition.value) {
			let [group, moveDirection] = unit.ClosestGroup(groups, group_ => getCenterDirection(group_))

			if (!unit.IsInRange(moveDirection, 500)) {
				if (!GoingToBestPosition(unit))
					ControllablesUnitsDraw.set(unit, "Waiting Creeps")
				return
			}

			Stopping(unit, group as Creep[], moveDirection)

		} else {

			groups.forEach(group => {

				let moveDirection = getCenterDirection(group)

				if (!unit.IsInRange(moveDirection, 500))
					return

				Stopping(unit, group, moveDirection)
			})
		}
	})

	return controllables.length
}

function Stopping(unit: Unit, creeps: Creep[], moveDirection = getCenterDirection(creeps)) {

	if (CheckTowerNear(unit)) {
		ControllablesUnitsDraw.set(unit, "Less stopping (Tower near)")
		MoveUnit(unit, moveDirection)
		return
	}

	ControllablesUnitsDraw.set(unit, "Stopping ")

	creeps = ArrayExtensions.orderBy(creeps, creep => creep.Distance2D(moveDirection))

	let stopping = creeps.some(creep => {

		if (!creep.IsMoving && !creep.IsInRange(unit, 50))
			return false

		let creepDistance = creep.Distance2D(moveDirection) + 50,
			unitDistance = unit.Distance2D(moveDirection),
			creepAngle = creep.FindRotationAngle(unit)

		if (creepDistance < unitDistance && creepAngle > 2 || creepAngle > 2.5)
			return false

		let npcSpeed = unit.IdealSpeed,
			creepSpeed = creep.IdealSpeed
		let moveDistance = ((Sensitivity.value + 45) * 10) / npcSpeed * 100

		if ((npcSpeed - creepSpeed) > 50)
			moveDistance -= (npcSpeed - creepSpeed) / 2

		let movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle))

		if (movePosition.Distance2D(moveDirection) - 50 > unitDistance)
			return false

		if (creepAngle < 0.2 && unit.IsMoving)
			return false

		MoveUnit(unit, movePosition)

		return true
	})

	if (stopping)
		return

	if (unit.IsMoving)
		unit.OrderStop()
	else if (unit.FindRotationAngle(moveDirection) > 1.5)
		MoveUnit(unit, unit.Position.Extend(moveDirection, 10))
}
