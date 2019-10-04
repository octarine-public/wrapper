import { Menu, MenuBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Enemy Lane Selection")

var ShowAfterGameStart = BaseTree.AddToggle("Show after game start", true)

export { State, BaseTree, ShowAfterGameStart }