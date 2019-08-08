import { Vector3, Unit, EntityManager, Entity, Color } from 'wrapper/Imports';
export class Projectile{
    readonly ProjectileID: number
    protected SourceUnit: Unit | number;
    protected path: string;
    protected particleSystemHandle: bigint;
    constructor(projID: number,path: string,particleSystemHandle: bigint,SourceUnit: Unit | number = undefined){
        this.ProjectileID = projID
        this.path = path
        this.particleSystemHandle = particleSystemHandle
        if(SourceUnit instanceof Unit)
            this.SourceUnit = SourceUnit as Unit
        else
            this.SourceUnit = SourceUnit
    }
    get Source(): Unit | number {
        if(this.SourceUnit instanceof Unit)
            return this.SourceUnit
        else{
            const unit = EntityManager.EntityByIndex(this.SourceUnit)
            if(unit!==undefined){
                return unit as Unit
            }
        }
        return this.SourceUnit
    }
    get particle(): string{
        return this.path
    }
    get ParticleSystemHandle(): bigint{
        return this.particleSystemHandle
    }
}
export class LineProjectile extends Projectile{
    readonly maxSpeed: number;
    readonly fowRadius: number;
    readonly stickyFowReveal: boolean;
    readonly distance: number;
    readonly colorgemcolor: Color;
    constructor(proj,ent,path,particleSystemHandle,maxSpeed,fowRadius,stickyFowReveal,distance,colorgemcolor){
        super(proj,path,particleSystemHandle,ent)
        this.maxSpeed = maxSpeed
        this.fowRadius = fowRadius
        this.stickyFowReveal = stickyFowReveal
        this.distance = distance
        this.colorgemcolor = colorgemcolor
    }
}
export class TrackProjectile extends Projectile{
    private TargetEntity: Unit|number;
    private isAttack: boolean;
    private expire: number;
    private speed: number;
    readonly sourceAttachment: number;
    readonly maximpacttime: number;
    protected tick: number;
    private dodgeable: boolean;
    private dodged = false;
    get IsDodgeable(): boolean {
        return this.dodgeable
	}
    get IsDodged(): boolean {
        return this.dodged
	}
    get IsAttack(): boolean {
        return this.isAttack
	}
    get ExpireTime(): number {
        return this.expire
	}
    get Speed(): number {
        return this.speed
	}
    get Target(): Unit | number {
        if(this.TargetEntity instanceof Unit)
            return this.TargetEntity
        else{
            const unit = EntityManager.EntityByIndex(this.TargetEntity)
            if(unit!==undefined){
                return unit as Unit
            }
        }
        return this.TargetEntity
    }
    get launchTick(): number{
        return this.tick
    }
    constructor(proj,source,target,ms,sourceAttachment,path,pSH,dodgeable,isAttack,expire,maximpacttime,launch_tick){
        super(proj,path,pSH,source)
        this.TargetEntity = target
        this.speed = ms
        this.dodgeable = dodgeable
        this.isAttack = isAttack
        this.expire = expire
        this.sourceAttachment = sourceAttachment
        this.maximpacttime = maximpacttime
        this.tick = launch_tick
    }
    Update(path,particleSystemHandle,launchTick){
        this.path = path
        this.particleSystemHandle = particleSystemHandle
        this.tick = launchTick
    }
    Dodge(){
        this.dodged = true
    }
}