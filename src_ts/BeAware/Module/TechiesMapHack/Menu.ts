import { Menu, MenuBase, MenuDrawBase } from "../../abstract/Menu.Base";
const { BaseTree, State } = MenuBase(Menu, "Techies Mine mapHack");
const { DrawRGBA, Size, ComboBox } = MenuDrawBase(BaseTree,
	"Color", null, [],
	"Size", 32, 14, 100
);
State.SetToolTip("Display position enemy heroes if use ability");
export { State, DrawRGBA, Size, ComboBox };
