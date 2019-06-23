import { EventsSDK, MenuManager, Game, LocalPlayer } from "./wrapper/Imports";

const PtswitcherMenu = MenuManager.MenuFactory("PT Switcher");
const state = PtswitcherMenu.AddToggle("State", false);

var nextTick: number = 0;
var changed: boolean = true;
var lastStat: number = undefined;

function IsValidMyHero(MyHero: any): boolean {
	return MyHero === undefined || MyHero.IsStunned || !MyHero.IsAlive || MyHero.IsInvisible || MyHero.IsInvulnerable || MyHero.IsChanneling;
}

EventsSDK.on("onUpdate", () => {
	
	if (!state.value)
		return;
		
	const MyHero = LocalPlayer.Hero;

	if (IsValidMyHero(MyHero))
		return;

	let pt = MyHero.Inventory.GetItemByName("item_power_treads");
	
	if (pt === undefined)
		return;

	let _PowerTreads = pt.m_pBaseEntity as C_DOTA_Item_PowerTreads; // ???

	if (undefined !== lastStat && Game.RawGameTime >= nextTick) {

		if (_PowerTreads.m_iStat !== lastStat && !changed) {
			MyHero.CastNoTarget(pt);
			nextTick = nextTick + 0.15 + GetAvgLatency(Flow_t.OUT);
		}
		if (_PowerTreads.m_iStat === lastStat){
			lastStat = undefined;
			changed = true;
		}
	}
})

Events.on("onPrepareUnitOrders", orders => {
	
	if (!state.value)
		return;
	
	const MyHero = LocalPlayer.Hero;

	if (IsValidMyHero(MyHero))
		return;
		
	let pt = MyHero.Inventory.GetItemByName("item_power_treads");

	if (pt === undefined)
		return;
		
	if (orders.order_type !== 5 && orders.order_type !== 6 
		&& orders.order_type !== 7 && orders.order_type !== 8 && orders.order_type !== 9) 
		return;
	
	let ability = orders.ability;
	
	if (!ability.m_iManaCost)
		return;
	
	let _PowerTreads = pt.m_pBaseEntity as C_DOTA_Item_PowerTreads; // ???

	if(changed) {
		lastStat = _PowerTreads.m_iStat;
	}
	
	if (_PowerTreads.m_iStat === 0){
		MyHero.CastNoTarget(pt);
	} else if (_PowerTreads.m_iStat === 2){
		MyHero.CastNoTarget(pt);
		MyHero.CastNoTarget(pt);
	}
	
	changed = false;
	nextTick = Game.RawGameTime + ability.m_fCastPoint + 0.45 + GetAvgLatency(Flow_t.OUT);

})