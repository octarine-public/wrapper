import { EventsSDK, Game, MenuManager, Vector3, Ability } from 'wrapper/Imports';

let { MenuFactory } = MenuManager,
	blink_range: number
const menu = MenuFactory("Perfect Dagger"),
	active = menu.AddToggle("Active")
EventsSDK.on("PrepareUnitOrders", order => {
	if (
		!active.value
		|| order.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		|| !((order.Ability as Ability).m_pBaseEntity instanceof C_DOTA_Item_BlinkDagger)
	)
		return true
	if (blink_range === undefined)
		blink_range = (order.Ability as Ability).GetSpecialValue("blink_range")
	if (order.Position.IsInRange(order.Unit.Position, blink_range))
		return true
	let vec: Vector3 = order.Unit.Position
	if (order.Unit.IsMoving)
		vec = order.Unit.Position
			.Add(order.Unit.Forward.MultiplyScalar(order.Unit.IdealSpeed * Game.GetLatency()))
			.Extend(order.Position, blink_range - 30)
	else
		vec = order.Unit.Position.Extend(order.Position, blink_range - 1)
	order.Unit.CastPosition((order.Ability as Ability), vec, false, true)
	return false
})
EventsSDK.on("GameEnded", () => blink_range = undefined)
