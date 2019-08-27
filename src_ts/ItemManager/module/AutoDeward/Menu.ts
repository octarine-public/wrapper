import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Deward")
// loop-optimizer: KEEP
let Items = [
	"item_quelling_blade",
	"item_bfury",
	"item_tango",
	"item_tango_single",
]
const StateItems = BaseTree.AddImageSelector("Items", Items)
export { State, StateItems, Items }
