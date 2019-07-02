import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2 } from "wrapper/Imports";
import Vector3 from './wrapper/Base/Vector3';
let { MenuFactory } = MenuManager,blink_range: number = undefined;
const menu = MenuFactory("Perfect Dagger"),
    active = menu.AddToggle("Active")
EventsSDK.on('PrepareUnitOrders',order => {
    if(active.value && order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION && order.Ability.Name === 'item_blink'){
        if(blink_range === undefined)
            blink_range = order.Ability.GetSpecialValue('blink_range')
        if(order.Unit.Distance2D(order.Position) > blink_range){
            let vec = order.Unit.Position.Extend(order.Position,blink_range)
            console.log(order.Unit.Distance2D(order.Position))
            console.log(order.Unit.Distance2D(vec))
            order.Unit.CastPosition(order.Ability,vec,false,true)
            return false
        }
    }
    return true
})
EventsSDK.on("GameEnded", () => blink_range = undefined)