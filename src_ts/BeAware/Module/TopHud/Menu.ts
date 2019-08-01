import { Menu, MenuBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "Top Hud")

const NotificationTopVision = BaseTree.AddToggle("Visibility of allies",true,'Shows blue rectangles under visible allies'),
    topSentry = BaseTree.AddToggle('TrueSight visibility of allies',true,'Shows royalblue rectangles under truesighted allies')

export { State, BaseTree, NotificationTopVision,topSentry};
