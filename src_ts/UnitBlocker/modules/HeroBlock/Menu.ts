import { Menu, MenuBase, MenuDraw } from "../../base/MenuBase"

import MenuControllables from "../Controllables"

const {
	BaseTree,
	State,
	Key,
	KeyStyle,
	Sensitivity,
} = MenuBase(Menu, "Hero Block", "9")

const {
	BaseTree: BaseTreeAlly,
	State: StateAlly,
	Key: KeyAlly,
	KeyStyle: KeyStyleAlly,
	Sensitivity: SensitivityAlly,
} = MenuBase(BaseTree, "Hero Block (Allies)")

const {
	ControllablesTree,
	StateUnits,
	CenterCamera,
	CountUnits,
} = MenuControllables(BaseTree)

const SpreadUnits = ControllablesTree.AddToggle("Spread units", true)
	.SetTooltip("If enabled units will try to form an arc, otherwise they all will run in front of the hero")

const {
	DrawState,
	StatusAroundUnits,
	StatusMouse,
} = MenuDraw(BaseTree)

export {
	State,
	Key,
	KeyStyle,
	Sensitivity,

	BaseTreeAlly,
	StateAlly,
	KeyAlly,
	KeyStyleAlly,
	SensitivityAlly,

	StateUnits,
	CenterCamera,
	CountUnits,
	SpreadUnits,

	DrawState,
	StatusMouse,
	StatusAroundUnits,
}
