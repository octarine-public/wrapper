import { ArrayExtensions, GameSleeper, Hero, LocalPlayer, RendererSDK, Unit, Utils, Vector3, Game } from "wrapper/Imports"

import { allHeroes } from "../../base/Listeners"

import {
	baseCheckUnit,
	Controllables,
	MoveUnit,
	SelectedStopping,
	StopUnit,
} from "../Controllables"

import {
	CenterCamera,
	CountUnits,
	DrawState,
	Key,

	KeyAlly,
	KeyStyle,
	KeyStyleAlly,
	Sensitivity,

	SensitivityAlly,
	SpreadUnits,
	State,
	StateAlly,

	StateUnits,
	StatusAroundUnits,
	StatusMouse,
} from "./Menu"

enum TargetStatus {
	NOT_VALID = "Waiting Hero",
	VALID = "Blocking",
	DEAD = "Hero is dead",
	DORMANT = "Hero is not visible",
	IS_NOT_IN_RANGE = "",
}

enum StateBlock {
	Enemy,
	Ally,
}

let sleeper = new GameSleeper()

let turnStateBlock: boolean = false
let stateBlock = StateBlock.Enemy
let ControllablesUnitsDraw = new Map<Unit, string>()
let targetBlock: Hero
let targetStatus = TargetStatus.NOT_VALID

CountUnits.OnValue(() => ControllablesUnitsDraw.clear())

function OnPressed() {
	turnStateBlock = !turnStateBlock

	if (!turnStateBlock) {
		targetBlock = undefined
		ControllablesUnitsDraw.clear()
	}

	if (KeyStyle.selected_id === 1)
		Game.ExecuteCommand((turnStateBlock ? "+" : "-") + "dota_camera_center_on_hero")
}

function OnExecute(isPressed: boolean) {
	if (StateUnits.selected_id !== 0 || KeyStyle.selected_id !== 0)
		return

	isPressed ? TurnOn() : TurnOff()
}

Key.OnPressed(() => {
	stateBlock = StateBlock.Enemy
	OnPressed()
})
Key.OnValue(caller => {
	stateBlock = StateBlock.Enemy
	OnExecute(caller.is_pressed)
})
KeyAlly.OnPressed(() => {
	stateBlock = StateBlock.Ally
	OnPressed()
})
KeyAlly.OnValue(caller => {
	stateBlock = StateBlock.Ally
	OnExecute(caller.is_pressed)
})

export function GameEnded() {
	turnStateBlock = false
	sleeper.FullReset()
}

export function Update(): number {
	if (!IsOn() || sleeper.Sleeping("tick"))
		return

	if (targetBlock !== undefined) {
		if (!targetBlock.IsAlive) {
			targetStatus = TargetStatus.DEAD
			return
		} else if (targetBlock.IsDormant) {
			targetStatus = TargetStatus.DORMANT
			return
		}

		targetStatus = TargetStatus.VALID
	} else
		targetStatus = TargetStatus.NOT_VALID

	let countUnits = 0

	switch (StateUnits.selected_id) {
		case 0: { // local
			let localHero = LocalPlayer.Hero

			if (localHero === undefined || !baseCheckUnit(localHero))
				return

			if (targetBlock === undefined)
				targetBlock = GetClosestHero(hero => hero !== localHero)

			if (targetBlock === undefined)
				return

			Block(localHero)
			countUnits += 1

			break
		}
		/* case 1: {
			let selected = SelectedStopping()

			if (selected.length === 0)
				return;

			if (targetBlock === undefined)
				targetBlock = GetClosestHero(hero => { console.log(hero); return selected.some(unit => { console.log("\t|", unit.Index, hero.Index); return unit !== hero; }); });

			if (targetBlock === undefined)
				return;

			BlockMulty(selected)
			break;
		} */
		case 1: {
			let controllables = Controllables()

			if (controllables.length === 0)
				return

			let localHero = LocalPlayer.Hero

			if (localHero !== undefined && baseCheckUnit(localHero))
				ArrayExtensions.arrayRemove(controllables, localHero)

			if (targetBlock === undefined)
				targetBlock = GetClosestHero(hero => controllables.some(unit => unit !== hero))

			if (targetBlock === undefined)
				return

			ArrayExtensions.arrayRemove(controllables, targetBlock)

			countUnits += BlockMulty(controllables)

			break
		}
		case 2: {
			let controllables = Controllables()

			if (controllables.length === 0)
				return

			if (targetBlock === undefined)
				targetBlock = GetClosestHero(hero => controllables.some(unit => unit !== hero))

			if (targetBlock === undefined)
				return

			ArrayExtensions.arrayRemove(controllables, targetBlock)

			countUnits += BlockMulty(controllables)

			break
		}
		default:
			break
	}

	sleeper.Sleep(countUnits * 100, "tick")
}

export function Draw(): string {
	if (!DrawState.value || !IsOn())
		return

	if (StatusAroundUnits.value) {
		// loop-optimizer: KEEP
		ControllablesUnitsDraw.forEach((text, unit) => {

			if (targetStatus !== TargetStatus.VALID)
				ControllablesUnitsDraw.set(unit, text = targetStatus)

			let wts = RendererSDK.WorldToScreen(unit.Position)

			if (wts !== undefined)
				RendererSDK.Text(text, wts)
		})
	}

	return StatusMouse.value ? `HeroBlock${stateBlock === StateBlock.Ally ? " Ally" : ""}: ON | ${targetStatus}` : undefined
}

function TurnOn() {
	if (CenterCamera.value)
		Game.ExecuteCommand("+dota_camera_center_on_hero")
}

function TurnOff() {
	Game.ExecuteCommand("-dota_camera_center_on_hero")
	targetBlock = undefined
	ControllablesUnitsDraw.clear()
}

function GetClosestHero(exclude: (unit: Hero) => boolean) {
	let mouseCursor = Utils.CursorWorldVec

	return ArrayExtensions.orderBy(allHeroes, hero => hero.Distance2D(mouseCursor))
		.find(hero => hero.IsAlive && !hero.IsIllusion && hero.IsVisible && hero.IsInRange(mouseCursor, 1000)
			&& (stateBlock === StateBlock.Enemy) === hero.IsEnemy() && exclude(hero))
}

function IsOn() {
	let stateEnemy = stateBlock === StateBlock.Enemy

	let stateOn = stateEnemy ? State.value : StateAlly.value

	if (!stateOn)
		return false

	let keyStyle = stateEnemy ? KeyStyle : KeyStyleAlly,
		key = stateEnemy ? Key : KeyAlly

	if ((keyStyle.selected_id === 1 && !turnStateBlock) ||
		(keyStyle.selected_id === 0 && !key.is_pressed))
		return false

	return true
}

let GetSensitivity = () => ((stateBlock === StateBlock.Enemy ? Sensitivity.value : SensitivityAlly.value) + 3) * 10

function Block(unit: Unit) {

	if (!unit.IsInRange(targetBlock, 1000)) {
		ControllablesUnitsDraw.delete(unit)
		return
	}

	ControllablesUnitsDraw.set(unit, TargetStatus.VALID)

	let angle = targetBlock.FindRotationAngle(unit)

	let blockPos: Vector3

	if (angle > 1.3) {

		let delta = angle * 0.6

		let vecRight = targetBlock.InFrontFromAngle(delta, Math.max(GetSensitivity(), 150))

		let vecLeft = targetBlock.InFrontFromAngle(-delta, Math.max(GetSensitivity(), 150))

		blockPos = unit.Distance2D(vecRight) < unit.Distance2D(vecLeft) ? vecRight : vecLeft

	} else {

		if (targetBlock.IsMoving && angle < 0.3 && unit.IsMoving) {
			StopUnit(unit)
			return
		}

		blockPos = targetBlock.InFront(GetSensitivity())
	}

	MoveUnit(unit, blockPos)
}

function BlockMulty(units: Unit[]) {

	units = units.filter(unit => {
		if (unit.IsInRange(targetBlock, 1000))
			return true

		ControllablesUnitsDraw.delete(unit)
		return false
	})

	if (units.length === 0)
		return

	units.splice(CountUnits.value)

	let countUnits = units.length

	units.forEach((unit, index) => {

		ControllablesUnitsDraw.set(unit, TargetStatus.VALID)

		let angleForUnit = SpreadUnits.value
			? Math.ceil(index / 2) * (index % 2 === 0 ? -1 + countUnits * 0.06 : -1 - countUnits * 0.06)
			: 0

		let blockPos = targetBlock.InFrontFromAngle(angleForUnit, GetSensitivity())

		ArrayExtensions.arrayRemove(units, unit)

		let angle = targetBlock.FindRotationAngle(unit)

		if (angle > 1.1 + index * 0.5) {
			let delta = angle * 0.6
			let vecRight = targetBlock.InFrontFromAngle(delta, Math.max(GetSensitivity(), 150)),
				vecLeft = targetBlock.InFrontFromAngle(-delta, Math.max(GetSensitivity(), 150))

			blockPos = unit.Distance(vecRight) < unit.Distance(vecLeft) ? vecRight : vecLeft
		} else {
			if (targetBlock.IsMoving && angle < 0.3 && unit.IsMoving) {
				StopUnit(unit)
				return
			}

			blockPos = targetBlock.InFront(GetSensitivity())
		}

		MoveUnit(unit, blockPos)
	})

	return countUnits
}
