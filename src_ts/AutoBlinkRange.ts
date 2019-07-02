import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2 } from "wrapper/Imports";
import Vector3 from './wrapper/Base/Vector3';
let { MenuFactory } = MenuManager, IsAlive: boolean = false,blink_range: number = undefined;
const menu = MenuFactory("Auto Blink Range"),
    active = menu.AddToggle("Active")
EventsSDK.on('PrepareUnitOrders',order => {
    if(order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION && order.Ability.Name === 'item_blink'){
        if(blink_range === undefined)
            blink_range = order.Ability.GetSpecialValue('blink_range')
        let from = new Vector2(order.Position.x - order.Unit.Position.x,order.Position.y - order.Unit.Position.y)
        from.MultiplyScalar(blink_range / from.Length);
        if(order.Unit.Distance2D(order.Position) > blink_range)
            order.Position = new Vector2(order.Position.x - order.Unit.Position.x,order.Position.y - order.Unit.Position.y)
    }
    return true;
})