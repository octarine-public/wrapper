import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2, Unit, Color,EntityManager,Hero,Modifier } from "wrapper/Imports";
import { Projectile, LineProjectile, TrackProjectile } from '../Objects/Base/Projectile';
import { arrayRemove } from "../Utils/ArrayExtensions"
let AllProjectiles: Projectile[] = [],
    AllProjectilesAsMap = new Map<number,LineProjectile|TrackProjectile>()
class ProjectilesManager{
	get AllProjectiles(): Projectile[] {
		return AllProjectiles.slice()
	}
}
export default new ProjectilesManager()
EventsSDK.on("TrackingProjectileCreated",(proj,source,target,ms,sourceAttachment,path,pSH,dodgeable,isAttack,expire,maximpacttime,launch_tick)=>{
    // let projectile = new TrackProjectile(proj,source,target,ms,sourceAttachment,path,pSH,dodgeable,isAttack,expire,maximpacttime,launch_tick)
    // console.log(proj,(source as Unit).Name,(target as Unit).Name,ms,sourceAttachment,path,dodgeable,isAttack,expire,maximpacttime,launch_tick)

    /*
    EventsSDK.emit('TrackProjectileCreated',false,projectile)
    AllProjectiles.push(projectile)
    AllProjectilesAsMap.set(proj,projectile)*/
})
EventsSDK.on("LinearProjectileCreated",(proj,ent,path,particleSystemHandle,maxSpeed,fowRadius,stickyFowReveal,distance,colorgemcolor)=>{
    // console.log(proj)




    /*let projectile = new LineProjectile(proj,ent,path,particleSystemHandle,maxSpeed,fowRadius,stickyFowReveal,distance,colorgemcolor)
    EventsSDK.emit('LineProjectileCreated',false,projectile)
    AllProjectiles.push(projectile)
    AllProjectilesAsMap.set(proj,projectile)*/
})
/*
EventsSDK.on("TrackingProjectileDestroyed",(proj)=>{
    let projectile = AllProjectilesAsMap.get(proj)
    EventsSDK.emit('TrackProjectileDestroyed',false,projectile)
    arrayRemove(AllProjectiles,projectile)
    AllProjectilesAsMap.delete(proj)
})
EventsSDK.on("TrackingProjectilesDodged",(ent,attacks)=>{
    AllProjectiles.forEach((val)=>{
        if(val instanceof TrackProjectile){
            if(val.Target === ent){
                if(attacks && val.IsAttack && val.IsDodgeable)
                    val.Dodged()
                else if(!attacks && val.IsDodgeable)
                    val.Dodged()
            }
        }
        return true
    })
})
EventsSDK.on("TrackingProjectileUpdated",(proj,vSourceLoc,path,particleSystemHandle,colorgemcolor,launchTick)=>{
    
})
EventsSDK.on("LinearProjectileDestroyed",(proj)=>{
    let projectile = AllProjectilesAsMap.get(proj)
    EventsSDK.emit('LineProjectileDestroyed',false,projectile)
    arrayRemove(AllProjectiles,projectile)
    AllProjectilesAsMap.delete(proj)
})*/