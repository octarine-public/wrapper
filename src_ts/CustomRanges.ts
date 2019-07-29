import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2, Unit, Color, EntityManager, Hero, Modifier, ArrayExtensions, Utils, Vector3, Ability, Item, Tree } from 'wrapper/Imports';
import { CreateRGBTree } from './wrapper/Menu/MenuManager';
import { LocalPlayer } from './wrapper/Managers/EntityManager';
import Button from './wrapper/Menu/Button';
import ListBox from './wrapper/Menu/ListBox';
let { MenuFactory } = MenuManager
const menu = MenuFactory("Custom Ranges"),
    active = menu.AddToggle("Active"),
    first = menu.AddTree('Custom radius #1'),
    fActive = first.AddCheckBox('Active'),
    fRange = first.AddSlider('Range',1300,100,4000),
    fColor = CreateRGBTree(first,'Color',new Color(0,255,0)),
    second = menu.AddTree('Custom radius #2'),
    sActive = second.AddCheckBox('Active'),
    sRange = second.AddSlider('Range',1300,100,4000),
    sColor = CreateRGBTree(second,'Color',new Color(0,255,0)),
    refresh = menu.AddButton('Refresh','Refresh Abilities and Items'),
    abils = menu.AddListBox('Abilities',[]),
    items = menu.AddListBox('Item',[]),
    abColors = menu.AddTree('Ability Colors','If you choose abilities, there will be colors'),
    itmColors = menu.AddTree('Item Colors','If you choose items, there will be colors')

let fPart = undefined,
    sPart = undefined,
    fCache = undefined,
    sCache = undefined,
    abilsParticles: Map<Ability,number> = new Map(),
    abilsColors: Map<Ability,{}> = new Map(),
    abilsRanges: Map<Ability,number> = new Map(),
    itemsParticles: Map<Item,number> = new Map(),
    itemColors: Map<Item,{}> = new Map(),
    itemsRanges: Map<Item,number> = new Map()

active.OnValue(val=>{
    if(!val){
        if(fPart!==undefined){
            Particles.Destroy(fPart,true)
            fPart = undefined
        }
        if(sPart!==undefined){
            Particles.Destroy(sPart,true)
            sPart = undefined
        }
    }
    Refresh()
})

function removeMenu(obj){
    obj.clr.tree.parent.RemoveControl(obj.clr.tree)
    obj['men'].parent.RemoveControl(obj['men'])
}
function OnValAbility(val,list:ListBox){
    val.some((val,i)=>{
        const spell = LocalPlayer.Hero.AbilitiesBook.GetAbilityByName(list.values[i])
        if(val){
            if(spell !== undefined && spell.CastRange > 0 && !abilsParticles.has(spell)){
                const part = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero.m_pBaseEntity)
                LocalPlayer.Hero.Position.toIOBuffer()
                Particles.SetControlPoint(part, 0)
                LocalPlayer.Hero.Position.toIOBuffer()
                Particles.SetControlPoint(part, 2)
                new Vector3(spell.CastRange, 0, 0).toIOBuffer()
                Particles.SetControlPoint(part, 3)
                new Vector3(0, 255, 0).toIOBuffer()
                Particles.SetControlPoint(part, 4)
                abilsRanges.set(spell,spell.CastRange)
                abilsParticles.set(spell,part)
                const men = abColors.AddTree(spell.Name),
                    clr = CreateRGBTree(men,'Color')
                abilsColors.set(spell,{men,clr})
            }
        }else if(abilsParticles.has(spell)){
            Particles.Destroy(abilsParticles.get(spell),true)
            removeMenu(abilsColors.get(spell))
            abilsColors.delete(spell)
            abilsParticles.delete(spell)
        }
    })
}
function OnValItem(val,list:ListBox){
    val.some((val,i)=>{
        const spell = LocalPlayer.Hero.Inventory.GetItemByName(list.values[i])
        if(val){
            if(spell !== undefined && spell.CastRange > 0 && !itemsParticles.has(spell)){
                const part = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero.m_pBaseEntity)
                LocalPlayer.Hero.Position.toIOBuffer()
                Particles.SetControlPoint(part, 0)
                LocalPlayer.Hero.Position.toIOBuffer()
                Particles.SetControlPoint(part, 2)
                new Vector3(spell.CastRange, 0, 0).toIOBuffer()
                Particles.SetControlPoint(part, 3)
                new Vector3(0, 255, 0).toIOBuffer()
                Particles.SetControlPoint(part, 4)
                itemsRanges.set(spell,spell.CastRange)
                itemsParticles.set(spell,part)
                const men = itmColors.AddTree(spell.Name),
                    clr = CreateRGBTree(men,'Color')
                itemColors.set(spell,{men,clr})
            }
        }else if(itemsParticles.has(spell)){
            Particles.Destroy(itemsParticles.get(spell),true)
            removeMenu(itemColors.get(spell))
            itemColors.delete(spell)
            itemsParticles.delete(spell)
        }
    })
}
EventsSDK.on("Draw",()=>{
    if(!active.value || !Game.IsInGame || LocalPlayer.Hero === undefined || !LocalPlayer.Hero.IsAlive)
        return false
    if(fActive.value){
        if(fPart === undefined || fCache !== fRange.value){
            fCache = fRange.value
            if(fPart!==undefined)
                Particles.Destroy(fPart,true)
            fPart = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero.m_pBaseEntity)
        }
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(fPart, 0)
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(fPart, 2)
        new Vector3(fRange.value, 0, 0).toIOBuffer()
        Particles.SetControlPoint(fPart, 3)
        fColor.Color.toIOBuffer()
        Particles.SetControlPoint(fPart, 4)
    }else{
        if(fPart!==undefined){
            Particles.Destroy(fPart,true)
            fPart = undefined
        }
    }
    if(sActive.value){
        if(sPart === undefined || sCache !== sRange.value){
            sCache = fRange.value
            if(sPart!==undefined)
                Particles.Destroy(sPart,true)
            sPart = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero.m_pBaseEntity)
        }
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(sPart, 0)
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(sPart, 2)
        new Vector3(sRange.value, 0, 0).toIOBuffer()
        Particles.SetControlPoint(sPart, 3)
        sColor.Color.toIOBuffer()
        Particles.SetControlPoint(sPart, 4)
    }else{
        if(sPart!==undefined){
            Particles.Destroy(sPart,true)
            sPart = undefined
        }
    }


    let updateAbil = false,
        updateItem = false
    // loop-optimizer: KEEP
    abilsParticles.forEach((part,spell)=>{
        if(abilsRanges.get(spell)!==spell.CastRange)
            updateAbil = true
        if(updateAbil)
            return
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(part, 0)
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(part, 2)
        abilsColors.get(spell)['clr']['Color'].toIOBuffer()
        Particles.SetControlPoint(part, 4)
    })
    // loop-optimizer: KEEP
    itemsParticles.forEach((part,spell)=>{
        if(itemsRanges.get(spell)!==spell.CastRange)
            updateItem = true
        if(updateItem)
            return
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(part, 0)
        LocalPlayer.Hero.Position.toIOBuffer()
        Particles.SetControlPoint(part, 2)
        itemColors.get(spell)['clr']['Color'].toIOBuffer()
        Particles.SetControlPoint(part, 4)
    })
    if(updateAbil){
        // loop-optimizer: KEEP
        abilsParticles.forEach((val,spell)=>{
            removeMenu(abilsColors.get(spell))
            Particles.Destroy(val,true)
        })
        abilsParticles.clear()
        abilsColors.clear()
        OnValAbility(abils.selected_flags,abils)
    }
    if(updateItem){
        // loop-optimizer: KEEP
        itemsParticles.forEach((val,spell)=>{
            removeMenu(itemColors.get(spell))
            Particles.Destroy(val,true)
        })
        itemsParticles.clear()
        abilsColors.clear()
        OnValItem(items.selected_flags,items)
    }
})

abils.OnValue(OnValAbility)
items.OnValue(OnValItem)

function Refresh(arg?){
    // loop-optimizer: KEEP
    abilsParticles.forEach((val,spell)=>{
        removeMenu(abilsColors.get(spell))
        Particles.Destroy(val,true)
    })
    abilsParticles.clear()
    abilsColors.clear()
    // loop-optimizer: KEEP
    itemsParticles.forEach((val,spell)=>{
        removeMenu(itemColors.get(spell))
        Particles.Destroy(val,true)
    })
    itemsParticles.clear()
    itemColors.clear()
    abils.values = []
    items.values = []
    menu.Update()
    if(!active.value || !Game.IsInGame || LocalPlayer.Hero === undefined)
        return false
    for(let i = 0;i<24;i++){
        const spell = LocalPlayer.Hero.AbilitiesBook.GetSpell(i),
            item = LocalPlayer.Hero.Inventory.GetItem(i)
        if(spell !== undefined&&spell.Name !== 'generic_hidden'&&spell.Name.indexOf('special_bonus')===-1&&spell.Name.indexOf('seasonal')===-1&&spell.Name.indexOf('high_five')===-1){
            abils.values.push(spell.Name)
        }
        if(item !== undefined&&item.Name !== undefined&&item.CastRange>0){
            items.values.push(item.Name)
        }
    }
    if(arg!==undefined){
        OnValAbility(abils.selected_flags,abils)
        OnValItem(items.selected_flags,items)
    }
    menu.Update()
}
refresh.OnPress(Refresh)
EventsSDK.on("GameStarted",Refresh)
EventsSDK.on("GameEnded",()=>{
    if(fPart!==undefined){
        Particles.Destroy(fPart,true)
        fPart = undefined
    }
    if(sPart!==undefined){
        Particles.Destroy(sPart,true)
        sPart = undefined
    }
    Refresh()
})