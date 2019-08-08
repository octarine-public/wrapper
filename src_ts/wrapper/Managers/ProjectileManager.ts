import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2, Unit, Color,EntityManager,Hero,Modifier } from "wrapper/Imports";
import { Projectile, LineProjectile, TrackProjectile } from '../Objects/Base/Projectile';
import { arrayRemove } from "../Utils/ArrayExtensions"
let AllLineProjectiles: LineProjectile[] = [],
    AllLineProjectilesMap: Map<number,LineProjectile> = new Map(),
    AllTrackProjectilesMap: Map<number,TrackProjectile> = new Map(),
    AllTrackProjectiles: TrackProjectile[] = []
class ProjectilesManager{
	get AllLineProjectiles(): LineProjectile[] {
		return AllLineProjectiles.slice()
	}
	get AllTrackProjectiles(): TrackProjectile[] {
		return AllTrackProjectiles.slice()
	}
}
export default new ProjectilesManager()
EventsSDK.on("TrackingProjectileCreated",(proj,source,target,ms,sourceAttachment,path,pSH,dodgeable,isAttack,expire,maximpacttime,launch_tick)=>{
    let projectile = new TrackProjectile(proj,source,target,ms,sourceAttachment,path,pSH,dodgeable,isAttack,expire,maximpacttime,launch_tick)
    EventsSDK.emit('TrackProjectileCreated',false,projectile)
    AllTrackProjectiles.push(projectile)
    AllTrackProjectilesMap.set(proj,projectile)
})
EventsSDK.on("LinearProjectileCreated",(proj,ent,path,particleSystemHandle,maxSpeed,fowRadius,stickyFowReveal,distance,colorgemcolor)=>{
    let projectile = new LineProjectile(proj,ent,path,particleSystemHandle,maxSpeed,fowRadius,stickyFowReveal,distance,colorgemcolor)
    EventsSDK.emit('LineProjectileCreated',false,projectile)
    AllLineProjectiles.push(projectile)
    AllLineProjectilesMap.set(proj,projectile)
})

EventsSDK.on("TrackingProjectileDestroyed",(proj)=>{
    let projectile = AllTrackProjectilesMap.get(proj)
    if(projectile){
        EventsSDK.emit('TrackProjectileDestroyed',false,projectile)
        arrayRemove(AllTrackProjectiles,projectile)
        AllTrackProjectilesMap.delete(proj)
    }
})

EventsSDK.on("TrackingProjectilesDodged",(ent,attacks)=>{
    AllTrackProjectiles.forEach((val)=>{
        if(val.Target === ent){
            if(attacks && val.IsAttack && val.IsDodgeable)
                val.Dodge()
            else if(!attacks && val.IsDodgeable)
                val.Dodge()
        }
        return true
    })
})
EventsSDK.on("TrackingProjectileUpdated",(proj,path,particleSystemHandle,launchTick)=>{
    let projectile = AllTrackProjectilesMap.get(proj)
    if(projectile)
        projectile.Update(path,particleSystemHandle,launchTick)
})
EventsSDK.on("LinearProjectileDestroyed",(proj)=>{
    let projectile = AllLineProjectilesMap.get(proj)
    if(projectile){
        EventsSDK.emit('LineProjectileDestroyed',false,projectile)
        arrayRemove(AllLineProjectiles,projectile)
        AllLineProjectilesMap.delete(proj)
    }
})