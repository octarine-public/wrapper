import { ArrayExtensions, Vector3, Unit, Creep, LocalPlayer, RendererSDK } from "../../../CrutchesSDK/Imports";

import { allCreeps, allTowers } from "../../base/Listeners";

import { stateMain } from "../../base/MenuBase";

import {
	checkSleeping,
	Controllables,
	baseCheckUnit,
	SelectedStopping,
	getCenterDirection,
	MoveUnit,
	StopUnit
} from "../Controllables";

import {
	State,
	Key,
	KeyStyle,
	Sensitivity,
	GoToBestPosition,
	SkipRange,

	StateUnits,
	CenterCamera,
	CountUnits,

	DrawState,
	StatusMouse,
	StatusAroundUnits,
	DrawHeplPosition
} from "./Menu";

import { DrawParticles, RemoveParticles, BestPosition } from "./ParticleHelp";


let Turning = (value: boolean) => value ? DrawParticles() : RemoveParticles();
let turnStateBlock: boolean = false;
let ControllablesUnitsDraw = new Map<Unit, string>();

State.OnValue(Turning);
DrawState.OnValue(Turning);
DrawHeplPosition.OnValue(Turning);
stateMain.OnValue(Turning);

CountUnits.OnValue(() => ControllablesUnitsDraw.clear());

Key.OnPressed(() => {
	turnStateBlock = !turnStateBlock

	if (!turnStateBlock)
		ControllablesUnitsDraw.clear();

	if (KeyStyle.selected_id === 1)
		SendToConsole((turnStateBlock ? "+" : "-") + "dota_camera_center_on_hero");
})

Key.OnExecute(isPressed => {
	if (!CenterCamera.value || StateUnits.selected_id !== 0 || KeyStyle.selected_id !== 0)
		return;

	SendToConsole((isPressed ? "+" : "-") + "dota_camera_center_on_hero");

	if (!isPressed)
		ControllablesUnitsDraw.clear();
});

export function GameStarted() {
	DrawParticles();
}

export function GameEnded() {
	turnStateBlock = false;
}

export function Update() {

	if (!State.value)
		return;

	if ((KeyStyle.selected_id === 1 && !turnStateBlock) ||
		(KeyStyle.selected_id === 0 && !Key.IsPressed))
		return;

	switch (StateUnits.selected_id) {
		case 0: { // local

			let localHero = LocalPlayer.Hero;

			if (localHero === undefined || checkSleeping(localHero) || !baseCheckUnit(localHero))
				return;

			let creeps = GetCreeps(localHero);

			if (creeps.length === 0) {

				if (GoingToBestPosition(localHero))
					return;

				ControllablesUnitsDraw.set(localHero, "Waiting Creeps");
				return;
			}

			StoppingAlone(localHero, creeps);
			break;
		}
		case 1: PreparingUnits(SelectedStopping()); break;
		case 2: PreparingUnits(Controllables()); break;
	}
}

export function Draw(): string {
	if (!State.value || !DrawState.value)
		return;

	if ((KeyStyle.selected_id === 1 && !turnStateBlock) ||
		(KeyStyle.selected_id === 0 && !Key.IsPressed))
		return;

	if (StatusAroundUnits.value) {
		//console.log(ControllablesUnitsDraw.size);
		// loop-optimizer: KEEP 
		ControllablesUnitsDraw.forEach((text, unit) => {
			//console.log(unit, text);
			let wts = RendererSDK.WorldToScreen(unit.Position);

			if (wts.IsValid)
				RendererSDK.Text(text, wts);
		})
	}

	return StatusMouse.value ? "CreepBlock: ON" : undefined;
}

function GetCreeps(unit?: Unit): Creep[] {
	return allCreeps.filter(creep => {
		if (SkipRange.value && creep.IsRangeAttacker)
			return false;

		if (unit !== undefined && !creep.IsInRange(unit, 500))
			return false;

		return !creep.IsControllable && !creep.IsWaitingToSpawn && creep.IsAlive;
	});
}

function GetGroupsCreeps() {
	let groups: Creep[][] = [];

	let creeps = GetCreeps();

	creeps.forEach(creep => {
		let group = creeps.filter(creepNear => creep.IsInRange(creepNear, 500)
			&& !groups.some(group => group.some(creepInGroup => creepInGroup === creep)));

		if (group.length > 0)
			groups.push(group);
	});

	return groups;
}

function CheckTowerNear(unit: Unit): boolean {
	return allTowers.some(tower => tower.IsAlive
		&& tower.Name === "npc_dota_badguys_tower2_mid"
		&& tower.IsInRange(unit, 200));
}

function GoingToBestPosition(unit: Unit): boolean {

	let closest = unit.NetworkPosition.Closest(BestPosition[unit.Team - 2]);

	if (unit.IsInRange(closest, 100))
		return false;

	MoveUnit(unit, closest);
	ControllablesUnitsDraw.set(unit, "Moving to the best position");

	return true;
}

function PreparingUnits(controllables: Unit[]) {

	if (controllables.length === 0)
		return;

	controllables.splice(CountUnits.value)
	
	let groups = GetGroupsCreeps();

	controllables.forEach(unit => {

		if (checkSleeping(unit))
			return;
		
		let command = ControllablesUnitsDraw.get(unit);

		if (command === undefined)
			ControllablesUnitsDraw.set(unit, "Waiting Creeps");

		if (GoToBestPosition.value) {

			let [group, moveDirection] = unit.ClosestGroup(groups, group => getCenterDirection(group));

			if (!unit.IsInRange(moveDirection, 500)) {
				if (!GoingToBestPosition(unit))
					ControllablesUnitsDraw.set(unit, "Waiting Creeps");
				return
			}

			StoppingAlone(unit, group as Creep[], moveDirection);

		} else {

			groups.forEach(group => {

				let moveDirection = getCenterDirection(group);

				if (!unit.IsInRange(moveDirection, 500))
					return

				StoppingAlone(unit, group, moveDirection);
			});
		}
	})
}

function StoppingMulty(controllables: Unit[], creep: Vector3, angleDirection: number, isMoving: boolean) {
	//let blockPos = creep.InFront((Sensitivity.value + 10) * 10);

	let unit = controllables[0];

	if (unit === undefined)
		return;

	//ArrayExtensions.arrayRemove(controllables, unit);

	let angle = creep.FindRotationAngle(unit.Position, angleDirection);

	let blockPos: Vector3;
	console.log(angle);
	if (angle > 1.1) {

		let delta = angle * 0.6;
		//console.log(delta)
		let vecRight = creep.InFrontFromAngle(angleDirection + delta, Math.max(Sensitivity.value * 10, 150))//moveDirection.InFrontFromAngle(delta, Math.max((Sensitivity.value + 45) * 10, 150))

		let vecLeft = creep.InFrontFromAngle(angleDirection + -delta, Math.max(Sensitivity.value * 10, 150))//moveDirection.InFrontFromAngle(-delta, Math.max((Sensitivity.value + 45) * 10, 150))

		blockPos = unit.Distance(vecRight) < unit.Distance(vecLeft) ? vecRight : vecLeft;
	}
	else {

		if (isMoving && angle < 0.3 && unit.IsMoving) {
			StopUnit(unit);
			return;
		}

		blockPos = creep.InFrontFromAngle(angleDirection, Sensitivity.value * 10)
	}
	MoveUnit(unit, blockPos)
}

function StoppingAlone(unit: Unit, creeps: Creep[], moveDirection = getCenterDirection(creeps)) {

	if (CheckTowerNear(unit)) {
		ControllablesUnitsDraw.set(unit, "Less stopping (Tower near)");
		MoveUnit(unit, moveDirection);
		return;
	}

	ControllablesUnitsDraw.set(unit, "Stopping");

	creeps = ArrayExtensions.orderBy(creeps, creep => creep.Distance2D(moveDirection));

	let stopping = creeps.some(creep => {

		if (!creep.IsMoving && !creep.IsInRange(unit, 50))
			return false;

		let creepDistance = creep.Distance2D(moveDirection) + 50,
			unitDistance = unit.Distance2D(moveDirection),
			creepAngle = creep.FindRotationAngle(unit);

		if (creepDistance < unitDistance && creepAngle > 2 || creepAngle > 2.5)
			return false;

		let npcSpeed = unit.IdealSpeed,
			creepSpeed = creep.IdealSpeed;

		let moveDistance = ((Sensitivity.value + 45) * 10) / npcSpeed * 100;

		if ((npcSpeed - creepSpeed) > 50)
			moveDistance -= (npcSpeed - creepSpeed) / 2;

		let movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle));

		if (movePosition.Distance2D(moveDirection) - 50 > unitDistance)
			return false;

		if (creepAngle < 0.2 && unit.IsMoving)
			return false;

		MoveUnit(unit, movePosition);

		return true;
	});

	if (stopping)
		return;

	if (unit.IsMoving)
		unit.OrderStop();
	else if (unit.FindRotationAngle(moveDirection) > 1.5)
		MoveUnit(unit, unit.Position.Extend(moveDirection, 10));

}


/* function Multy() {
	let isMoving = group[0].IsMoving;

	let moveDirection = getCenterDirection(group),
		angleDirection = getCenterAngle(group);

	for (let i = countControlls; i--;) {

		let angleForUnit = SpreadUnits.value
			? Math.ceil(i / 2) * (i % 2 === 0 ? -1 + countControlls * 0.06 : -1 - countControlls * 0.06)
			: 1

		let blockPos = moveDirection.InFrontFromAngle(angleDirection + angleForUnit, Sensitivity.value * 10);

		let unit = ArrayExtensions.orderBy(controllables, unit => unit.Distance2D(blockPos))
			.find(unit => unit.IsInRange(blockPos, 1000))

		if (unit === undefined)
			return;

		ArrayExtensions.arrayRemove(controllables, unit);

		let angle = moveDirection.FindRotationAngle(unit.Position, angleDirection);

		console.log(angle, 1.1 + i * 0.5);

		if (angle > 1.1 + i * 0.5) {

			let delta = angle * 0.6;
			//console.log(delta)
			let vecRight = moveDirection.InFrontFromAngle(angleDirection + delta, Math.max(Sensitivity.value * 10, 150))//moveDirection.InFrontFromAngle(delta, Math.max((Sensitivity.value + 45) * 10, 150))
			DrawParticle(unit, unit.Index, vecRight, 200);

			let vecLeft = moveDirection.InFrontFromAngle(angleDirection + -delta, Math.max(Sensitivity.value * 10, 150))//moveDirection.InFrontFromAngle(-delta, Math.max((Sensitivity.value + 45) * 10, 150))
			DrawParticle(unit, unit.Index + 1, vecLeft, 200);

			UnitMoveTo(unit, unit.Distance(vecRight) < unit.Distance(vecLeft) ? vecRight : vecLeft);
			console.log(1);
			//DrawParticle(unit, blockPos, 200);
		}
		else {

			if (isMoving && angle < 0.3 && unit.IsMoving) {
				StopUnit(unit);
				return;
			}
			else {
				console.log(3);
				UnitMoveTo(unit, blockPos)
			}

			//blockPos = moveDirection.InFrontFromAngle(angleDirection, Sensitivity.value * 10);
		}

		//UnitMoveTo(unit, blockPos);
		//StopUnit(unit);
	}
} */

/* function Local() {
	let Me = LocalDOTAPlayer.m_hAssignedHero as Unit;

	let creeps = allCreeps.filter(creep => {
		if (SkipRange.value && creep.m_bIsRangedAttacker)
			return false;

		return !creep.m_bIsWaitingToSpawn && creep.m_bIsAlive && Me.IsInRange(creep, 500);
	});

	let countCreeps = creeps.length;
	//console.log(countCreeps);

	//MoveToPos(Me, Me.InFront(500), false);

	if (countCreeps === 0)
		return;

	let moveDirection = creeps
		.reduce((prev, curr) => prev.Add(curr.InFront(350)), new Vector3())
		.DivideScalar(countCreeps)

	let towers = allTowers.filter(tower => tower.m_bIsAlive && Me.IsInRange(tower, 200));

	if (towers.length > 0) {
		console.log("tower near");
		MoveToPosition(Me, moveDirection);
		return;
	}

	creeps = orderBy(creeps, creep => moveDirection.Distance2D(creep.m_vecNetworkOrigin));

	let stopping = creeps.some(creep => {

		if (!creep.m_bIsMoving && !creep.IsInRange(Me, 50))
			return false;

		let creepDistance = moveDirection.Distance2D(creep.m_vecNetworkOrigin) + 50,
			heroDistance = moveDirection.Distance2D(Me.m_vecNetworkOrigin),
			creepAngle = creep.FindRotationAngle(Me.m_vecNetworkOrigin);

		if (creepDistance < heroDistance && creepAngle > 2 || creepAngle > 2.5)
			return false;

		//console.log("Me.m_fIdealSpeed", Me.m_fIdealSpeed);

		let moveDistance = ((Sensitivity.value + 45) * 10) / Me.m_fIdealSpeed * 100;

		if (Me.m_fIdealSpeed - Me.m_fIdealSpeed > 50)
			moveDistance -= (Me.m_fIdealSpeed - Me.m_fIdealSpeed) / 2;

		let movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle));

		if (movePosition.Distance2D(moveDirection) - 50 > heroDistance)
			return false;

		if (creepAngle < 0.2 && Me.m_bIsMoving)
			return false;

		MoveToPosition(Me, movePosition);

		return true;
	});

	if (stopping)
		return;

	if (Me.m_bIsMoving)
		EntStop(Me, false)
	else if (Me.FindRotationAngle(moveDirection) > 1.5)
		MoveToPosition(Me, Me.m_vecNetworkOrigin.Extend(moveDirection, 10));
}
 */