import { MenuManager, Vector3, Unit, LocalPlayer, GameSleeper, Entity } from "../../CrutchesSDK/Imports";

import { allNPCs } from "../base/Listeners";

let sleeper = new GameSleeper();

export let baseCheckUnit = (ent: Unit) =>
	ent.IsAlive
	&& !ent.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_NO_ATTACK)
	&& !ent.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION)
	&& ent.HasMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND)

export let checkSleeping = (ent: Unit) => sleeper.Sleeping(ent.Index + "");
	
export let checkControllable = (ent: Unit) =>
	baseCheckUnit(ent) && ent.IsControllable
	
export let SelectedStopping = (): Unit[] =>
	LocalPlayer.SelectedUnits.filter(ent =>
		ent instanceof Unit && checkControllable(ent)) as Unit[];
	
export let Controllables = () => allNPCs.filter(checkControllable);

export let getCenterDirection = (units: Entity[]) =>
	Vector3.GetCenterType(units, unit => unit.InFront(350))
	
export let getCenterPosition = (units: Entity[]) =>
	Vector3.GetCenterType(units, unit => unit.NetworkPosition)

export let MoveUnit = (unit: Unit, pos: Vector3) => {
	unit.MoveTo(pos);
	sleeper.Sleep(45, unit.Index + "");
}
	
export let StopUnit = (unit: Unit) => {
	unit.OrderStop();
	sleeper.Sleep(45, unit.Index + "");
}
	
export default function Menu(root: MenuManager.MenuControllers.Tree) {
	
	const ControllablesTree = root.AddTree(root.name + " - Controllables");
	
	const StateUnits = ControllablesTree.AddComboBox("Units", [
		"Local Hero",
		"Selected Unit(s)",
		"All Controllables"
	]);
	
	const CenterCamera = ControllablesTree.AddToggle("Center Camera").SetToolTip("Centering camera on your hero");
	
	const CenterCameraIndex = CenterCamera.IndexInMenu;
	
	const CountUnits = ControllablesTree.AddSlider("Number of unit", 3, 1, 10).SetToolTip("Number of units to use")
	
	const CountUnitsIndex = CountUnits.IndexInMenu;
	
	if (StateUnits.selected_id === 0)
		ControllablesTree.RemoveControl(CountUnits);
	else
		ControllablesTree.RemoveControl(CenterCamera);
		
	StateUnits.OnValue(value => {
		
		if (value === 0) {
			
			if (CountUnits.IndexInMenu !== -1)
				ControllablesTree.RemoveControl(CountUnits);
			
			if (CenterCamera.IndexInMenu === -1)
				ControllablesTree.AddControl(CenterCamera, CenterCameraIndex);
		} else {
			
			if (CountUnits.IndexInMenu === -1)
				ControllablesTree.AddControl(CountUnits, CountUnitsIndex);
				
			if (CenterCamera.IndexInMenu !== -1)
				ControllablesTree.RemoveControl(CenterCamera);
		}
	});
	
	return {
		ControllablesTree,
		StateUnits,
		CenterCamera,
		CountUnits
		/* ,
		SpreadUnits: ControllablesTree.AddToggle("Spread units", true)
			.SetToolTip("If enabled units will try to form an arc, otherwise they all will run in front of the hero") */
	}
}
