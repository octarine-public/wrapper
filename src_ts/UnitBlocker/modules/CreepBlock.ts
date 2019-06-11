import { ArrayExtensions, Vector3, Unit, Creep, LocalPlayer, GameSleeper } from "../../CrutchesSDK/Imports";

import { Menu } from "../menu";

import { MenuBase, MenuDraw } from "../base/MenuBase";
import { Menu as MenuControllables, baseCheckUnit, checkControllable } from "./Controllables";

import { allCreeps, allTowers } from "../base/Listeners";

// --- Menu

let sleeper = new GameSleeper();

const {
	BaseTree,
	State,
	Key,
	KeyStyle,
	Sensitivity,
	CenterCamera
} = MenuBase(Menu, "Creep Block", "=");

const SkipRange = BaseTree.AddToggle("Skip range-creeps");

const {
	ControllablesTree,
	StateUnits,
	CountUnits,
	SpreadUnits
} = MenuControllables(BaseTree);

const {
	DrawTree,
	DrawState,
	PredictionParticle,
	StatusMouse
} = MenuDraw(BaseTree);

// --- Variables

let turnStateBlock: boolean = false;
let allParticles: number[] = [];

// --- Methods

Key.OnPressed(() => turnStateBlock = !turnStateBlock)

Key.OnExecute(isPressed => {

	if (CenterCamera.value && StateUnits.selected_id === 0)
		SendToConsole((isPressed ? "+" : "-") + "dota_camera_center_on_hero");

	/* if (particle !== undefined) {
		Particles.Destroy(particle, true);
		particle = undefined;
	} */
});


function MoveToPosition(ent: Unit, vec: Vector3) {

	/* if (particle === undefined) {
		particle = Particles.Create(
			"particles/ui_mouseactions/drag_selected_ring.vpcf",
			ParticleAttachment_t.PATTACH_ABSORIGIN,
			ent,
		)
		Particles.SetControlPoint(particle, 2, new Vector3(ent.m_flHullRadius * 1.1, 255));
		Particles.SetControlPoint(particle, 1, new Vector3(0, 255, 255));
	}


	Particles.SetControlPoint(particle, 0, vec);
 */
	ent.MoveTo(vec);
}
/* let partcls = [];

EventsSDK.on("onGameEnded", () => {
	// loop-optimizer: POSSIBLE_UNDEFINED 
	partcls.forEach(partl => Particles.Destroy(partl, true));
})

function DrawParticle(unit: Unit, pos: Vector3, range: number) {
	
	if (partcls[unit.Index] === undefined) {
		partcls[unit.Index] = Particles.Create("particles/ui_mouseactions/drag_selected_ring.vpcf", 0, unit.m_pBaseEntity);
		new Vector3(0, 255, 255).toIOBuffer();
		Particles.SetControlPoint(partcls[unit.Index], 1)
		new Vector3(range * 1.1, 255).toIOBuffer();
		Particles.SetControlPoint(partcls[unit.Index], 2)
	}

	pos.toIOBuffer();
	Particles.SetControlPoint(partcls[unit.Index], 0)
	
} */

export function Update() {

	if (!State.value)
		return;

	if ((KeyStyle.selected_id === 1 && !turnStateBlock) ||
		(KeyStyle.selected_id === 0 && !Key.IsPressed))
		return;

	switch (StateUnits.selected_id) {
		case 0: { // local
			
			let localHero = LocalPlayer.Hero;

			if (localHero === undefined || sleeper.Sleeping("block" + localHero.Index) || !baseCheckUnit(localHero))
				return;

			let creeps = GetCreeps(localHero);

			if (creeps.length === 0)
				return;
				
			//DrawParticle(creeps[0], Vector3.GetCenterCallback(creeps, creep => creep.Position), 400);
			
			Stopping(localHero, creeps, getMoveDirection(creeps));
			sleeper.Sleep(50, "block" + localHero.Index);
			break;
		}
		case 1: { // selected

			/* let controllables = SelectedStopping();
			//console.log(controllables);
			let countControlls = Math.min(controllables.length, CountUnits.value);

			if (countControlls === 0)
				return;
			
			let creeps = GetCreeps();
			
			// loop-optimizer: KEEP
			GetGroupsCreeps(creeps).forEach(group => {

				if (controllables.length === 0)
					return;
				
				let moveDirection = getMoveDirection(group);
				
				for (let i = countControlls; i--;) {
					
					let angleForUnit = SpreadUnits.value 
						? Math.ceil(i / 2) * (i % 2 === 0 ? -1 + countControlls * 0.06 : -1 - countControlls * 0.06)
						: 0
					
					let blockPos = moveDirection.Add(Vector3.FromAngle(angleForUnit).MultiplyScalar(Sensitivity.value));
					
					let filteredUnits = controllables.filter(unit => unit.IsInRange(blockPos, 400));
					
					if (filteredUnits.length === 0)
						return;
					
					let unit = ArrayExtensions.orderBy(filteredUnits, unit => unit.Distance2D(blockPos))[0];
					
					ArrayExtensions.arrayRemove(controllables, unit);

					let angle = unit.FindRotationAngle(moveDirection);
					
					if (angle > 1.1 * i * 0.5) {

						let delta = angle * 0.6;
						console.log(moveDirection.Rotated(delta), LocalPlayer.Hero.NetworkRotation);
						DrawParticle(group[1], moveDirection.Rotated(delta), 200);
						let side1 = moveDirection.Rotation(moveDirection.Rotated(delta), Math.max((Sensitivity.value + 45) * 10, 150));
						DrawParticle(LocalPlayer.Hero, side1, 200);
						let side2 = moveDirection.Rotation(moveDirection.Rotated(-delta), Math.max((Sensitivity.value + 45) * 10, 150));
						DrawParticle(group[0], side2, 200);
						
						blockPos = side1.Distance(unit.Position) < side2.Distance(unit.Position) ? side1 : side2;
					}
					else {
						
						if (angle < 0.3 && unit.IsMoving) {
							unit.UnitStop();
							return;
						}
					}
					
					unit.MoveTo(blockPos);
				}
			}); */

			break;
		}
		case 2: { // all controllables

			break;
		}
	}
}

export function Draw(): string {
	if (!DrawState.value || !StatusMouse.value)
		return "";

	/* let Pos = LocalPlayer.Hero.Position;
		
	RendererSDK.FilledCircle(Pos.x, Pos.y, 200); */

	/* groups.forEach(group => {
		
		let wts = RendererSDK.WorldToScreen(getMoveDirection(group));
		
		if (!wts.IsValid)
			return;
			
		RendererSDK.FilledCircle(wts.x, wts.y, 500);
	}) */

	return "";
}

function GetCreeps(unit?: Unit): Creep[] {
	return allCreeps.filter(creep => {
		if (SkipRange.value && creep.IsRangeAttacker)
			return false;

		if (unit !== undefined && !creep.IsInRange(unit, 500))
			return false;

		return !creep.IsWaitingToSpawn && creep.IsAlive;
	});
}

function GetGroupsCreeps(creeps: Creep[]) {
	let groups: Creep[][] = [];

	creeps.forEach(creep => {
		let group = creeps.filter(creepNear => creep.IsInRange(creepNear, 500)
			&& !groups.some(group => group.some(creepInGroup => creepInGroup === creep)));
		
		if (group.length > 0)
			groups.push(group);
	});

	return groups;
}

let getMoveDirection = (creeps: Creep[]) =>
	Vector3.GetCenterCallback(creeps, creep => creep.InFront(350))

let CheckTowerNear = (unit: Unit): boolean =>
	allTowers.some(tower => tower.IsAlive
		&& tower.Name === "npc_dota_badguys_tower2_mid"
		&& tower.IsInRange(unit, 200));

let SelectedStopping = (): Unit[] =>
	LocalPlayer.SelectedUnits.filter(ent =>
		ent instanceof Unit && checkControllable(ent)) as Unit[];


//function 

function Stopping(unit: Unit, creeps: Creep[], moveDirection: Vector3) {

	if (CheckTowerNear(unit)) {
		console.log("tower near");
		MoveToPosition(unit, moveDirection);
		return;
	}

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

		MoveToPosition(unit, movePosition);

		return true;
	});

	if (stopping)
		return;

	if (unit.IsMoving)
		unit.UnitStop();
	else if (unit.FindRotationAngle(moveDirection) > 1.5)
		MoveToPosition(unit, unit.Position.Extend(moveDirection, 10));

}

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