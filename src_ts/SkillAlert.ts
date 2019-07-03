import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2, Unit, Color } from "wrapper/Imports";
import Vector3 from './wrapper/Base/Vector3';
let { MenuFactory } = MenuManager
const menu = MenuFactory("Skill Alert"),
    active = menu.AddToggle("Active"),
    show = menu.AddListBox('Alert Skills',['Sun Strike','Torrent','Light Strike Array','Split Earth']),
    textSize = menu.AddSlider('Timer text size',17,10,30),
    spellIcons = menu.AddTree('Spell Icons'),
    icons = spellIcons.AddCheckBox("Show spell icons"),
	size = spellIcons.AddSlider("Size", 30, 3, 100),
	opacity = spellIcons.AddSlider("Opacity", 255, 0, 255),
    arModifiers = [
        "modifier_invoker_sun_strike",
        "modifier_kunkka_torrent_thinker",
        "modifier_lina_light_strike_array",
        "modifier_leshrac_split_earth_thinker"
    ],
    arDurations = [1.7,1.6,0.5,0.35],
    arSpecialDuration = [
        'delay',
        'delay',
        'light_strike_array_delay_time',
        'delay'
    ],
    arParticles = [
        ['particles/units/heroes/hero_invoker/invoker_sun_strike.vpcf',['pos','rad']],
        ['particles/units/heroes/hero_kunkka/kunkka_spell_torrent_bubbles.vpcf',['pos']],
        ['particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf',['pos','rad']]
    ] as [string, string[]][],
    arAbilities = [
        'invoker_sun_strike',
        'kunkka_torrent',
        'lina_light_strike_array',
        'leshrac_split_earth'
    ],
    arSounds = [
        'invoker_invo_ability_sunstrike_01',
        'kunkka_kunk_ability_torrent_01',
        'lina_lina_ability_lightstrike_02',
        'leshrac_lesh_ability_split_05'
    ],
    arSpecialValues = [
        'area_of_effect',
        'radius',
        'light_strike_array_aoe',
        'radius'
    ],
    talent = [false,'special_bonus_unique_kunkka']
let arTimers = [] as [number,number,string,Vector3][]


EventsSDK.on("BuffAdded", (ent,buff) => {
    if(!active.value)
        return
    if(ent.Name == 'npc_dota_thinker'){
        if(!ent.IsEnemy())
            return
        let index = arModifiers.indexOf(buff.Name)
        if(index !== -1){
            if(!show.selected_flags[index])
                return
            let radius = 175,
            delay = arDurations[index]
            if(ent.Owner instanceof Unit){
                let ability = ent.Owner.GetAbilityByName(arAbilities[index])
                if(ability != undefined){
                    radius = ability.GetSpecialValue(arSpecialValues[index])
                    delay = ability.GetSpecialValue(arSpecialDuration[index])
                    if(talent[index])
                        radius += ent.Owner.GetTalentValue(talent[index])
                }
            }
            let abPart
            if(arParticles[index]){
                abPart = Particles.Create(arParticles[index][0],ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,ent.m_pBaseEntity)
                arParticles[index][1].forEach((val,i)=>{
                    switch(val){
                        case 'pos':
                            ent.Position.toIOBuffer();
                            break;
                        case 'rad':
                            new Vector3(radius,radius,radius).toIOBuffer();
                            break;
                    }
                    Particles.SetControlPoint(abPart, i)
                })
            }
            const part = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf",ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,ent.m_pBaseEntity)
            ent.Position.toIOBuffer();
            Particles.SetControlPoint(part, 0)
            ent.Position.toIOBuffer();
            Particles.SetControlPoint(part, 2)
            new Vector3(radius,0,0).toIOBuffer();
            Particles.SetControlPoint(part, 3)
            new Vector3(255,255,255).toIOBuffer();
            Particles.SetControlPoint(part, 4)
            arTimers.push([Game.GameTime,delay,arAbilities[index],ent.Position.Clone()])
            setTimeout(()=>{
                Particles.Destroy(part,false)
                if(abPart)
                    Particles.Destroy(abPart,false)
            },delay * 1000)
        }
    }
});
EventsSDK.on("Draw",()=>{
    if(!active.value)
        return
    let delArray = [];
    arTimers.forEach((val,i)=>{
        let rend = val[0]-Game.GameTime+val[1]
        if(rend<=0){
            delArray.push(i)
            return
        }
        let vector = RendererSDK.WorldToScreen(val[3])
        if(!vector)
            return
        if(icons.value){
            RendererSDK.Image("panorama/images/spellicons/" + val[2] + "_png.vtex_c", vector, new Vector2(size.value, size.value), new Color(255, 255, 255, opacity.value))
            vector.AddScalarY(-30)
        }
        RendererSDK.Text(rend.toFixed(2),vector,Color.White,'Calibri',new Vector2(textSize.value,200))
        
    })
    delArray.forEach(val=>{
        arTimers.splice(val)
    })

})