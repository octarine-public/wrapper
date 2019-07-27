import { Color, Debug, Entity, EntityManager, EventsSDK, Game, Hero, MenuManager, Modifier, RendererSDK, Unit, Vector2, Ability } from "wrapper/Imports"
let { MenuFactory } = MenuManager
const menu = MenuFactory("Abyssal Abuser"),
    active = menu.AddToggle("Active")

let myHero: Hero = undefined
EventsSDK.on("BuffAdded",(npc,buff)=>{
    if(active.value && buff.Name === "modifier_bashed" && buff.Ability.Owner === myHero){
        const abys = myHero.GetItemByName('item_abyssal_blade')
        if(abys !== undefined && myHero.Inventory.HasFreeSlots(0,8,2)){
            myHero.DisassembleItem(abys,false)
            setTimeout(()=>{
                myHero.ItemSetCombineLock(myHero.GetItemByName('item_recipe_abyssal_blade',true),false)
                myHero.ItemSetCombineLock(myHero.GetItemByName('item_basher',true),false)
                myHero.ItemSetCombineLock(myHero.GetItemByName('item_vanguard',true),false)
            },50+Game.GetAvgLatency(Flow_t.IN))
        }
    }
})
EventsSDK.on("GameStarted",hero=>myHero = hero)
EventsSDK.on("GameEnded",()=>myHero = undefined)