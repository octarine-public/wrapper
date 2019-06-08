import { MenuManager, Vector3, Unit } from "../../CrutchesSDK/Imports";

import { allNPCs } from "../base/Listeners";

export let baseCheckUnit = (ent: Unit) =>
	ent.IsAlive
	&& !ent.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_NO_ATTACK)
	&& !ent.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION)
	&& ent.HasMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND)

export let checkControllable = (ent: Unit) =>
	baseCheckUnit(ent) && ent.IsControllable
	
export let Controllables = () => allNPCs.filter(checkControllable);

export function Menu(root: MenuManager.MenuControllers.Tree) {
	
	let ControllablesTree = root.AddTree("Controllables " + root.name);
	
	return {
		ControllablesTree,
		StateUnits: ControllablesTree.AddComboBox("Units", [
			"Local Hero",
			"Selected Unit(s)",
			"All Controllables"
		]),
		CountUnits: ControllablesTree.AddSlider("Number of unit", 3, 1, 10).SetToolTip("Number of units to use"),
		SpreadUnits: ControllablesTree.AddToggle("Spread units", true)
			.SetToolTip("If enabled units will try to form an arc, otherwise they all will run in front of the hero")
	}
}
