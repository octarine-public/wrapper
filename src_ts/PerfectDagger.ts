import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2 } from "wrapper/Imports";
import Vector3 from './wrapper/Base/Vector3';
let { MenuFactory } = MenuManager,blink_range: number = undefined;
const menu = MenuFactory("Perfect Dagger"),
    active = menu.AddToggle("Active")
EventsSDK.on('PrepareUnitOrders',order => {
    if(active.value && order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION && order.Ability.Name === 'item_blink'){
        if(blink_range === undefined)
            blink_range = order.Ability.GetSpecialValue('blink_range')
        if(!order.Position.IsInRange(order.Unit.Position,blink_range)){
            let vec
            if(order.Unit.IsMoving){
                vec = order.Unit.Position.Add(order.Unit.Forward.MultiplyScalar(order.Unit.IdealSpeed * Game.GetLatency())).Extend(order.Position,blink_range-30)
            }else
                vec = order.Unit.Position.Extend(order.Position,blink_range-1)
            order.Unit.CastPosition(order.Ability,vec,false,true)
            return false
        }
    }
    return true
})
EventsSDK.on("GameEnded", () => blink_range = undefined)