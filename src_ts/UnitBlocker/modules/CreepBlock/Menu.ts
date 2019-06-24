import { Menu, MenuBase, MenuDraw } from "../../base/MenuBase";

import MenuControllables from "../Controllables";

const {
	BaseTree,
	State,
	Key,
	KeyStyle,
	Sensitivity,
} = MenuBase(Menu, "Creep Block", "=");

const GoToBestPosition = BaseTree.AddToggle("Go to the best position", true)
	.SetToolTip("Going to the best position when waiting creeps (Visual: Help position)");
	
const SkipRange = BaseTree.AddToggle("Skip range-creeps");

const {
	StateUnits,
	CenterCamera,
	CountUnits
} = MenuControllables(BaseTree);

StateUnits.SetToolTip("More than two units(or heroes) for one line of creeps is not recommended")

const {
	DrawTree,
	DrawState,
	StatusAroundUnits,
	StatusMouse
} = MenuDraw(BaseTree);

const DrawHelpPosition = DrawTree.AddToggle("Best position", true)
	.SetToolTip("Drawing help particle where the best position for block creeps. Auto removed in 5 min after creating");

export {
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
	DrawHelpPosition
}