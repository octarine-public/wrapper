import { GetTurnData, UpdateFacing } from "../../Data/TurnData"
import { EAbilitySlot } from "../../Enums/EAbilitySlot"
import { EventPriority } from "../../Enums/EventPriority"
import { GameActivity } from "../../Enums/GameActivity"
import { Ability } from "../../Objects/Base/Ability"
import { Entity } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Item } from "../../Objects/Base/Item"
import { NeutralSpawner, NeutralSpawners } from "../../Objects/Base/NeutralSpawner"
import { TeamData } from "../../Objects/Base/TeamData"
import { Unit, Units } from "../../Objects/Base/Unit"
import { Wearable } from "../../Objects/Base/Wearable"
import { npc_dota_hero_wisp } from "../../Objects/Heroes/npc_dota_hero_wisp"
import { Miniboss } from "../../Objects/Units/Miniboss"
import { GameState } from "../../Utils/GameState"
import { AngleDiff } from "../../Utils/Math"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"
import { Prediction } from "../Prediction/Prediction"

new (class CPreUnitChanged {
	constructor() {
		EventsSDK.on(
			"PostDataUpdate",
			this.PostDataUpdate.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PreEntityCreated",
			this.PreEntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityCreated",
			this.EntityCreated.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitAnimation",
			this.UnitAnimation.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitAnimationEnd",
			this.UnitAnimationEnd.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitItemsChanged",
			this.UnitItemsChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"AbilityHiddenChanged",
			this.AbilityHiddenChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on("EntityDestroyed", this.EntityDestroyed.bind(this))
		EventsSDK.on("GameEvent", this.GameEvent.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on("UnitVisibleStateChanged", this.UnitVisibleStateChanged.bind(this))
	}
	protected UnitVisibleStateChanged(data: TeamData) {
		for (let i = Units.length - 1; i > -1; i--) {
			const unit = Units[i]
			unit.IsVisibleState = Unit.IsNpcVisibleState(data.NPCVisibleState, unit.Index)
		}
	}
	protected PostDataUpdate(dt: number) {
		if (dt === 0) {
			return
		}
		for (let i = Units.length - 1; i > -1; i--) {
			const unit = Units[i]
			// see: https://dota2.fandom.com/wiki/Health_Regeneration
			unit.HPRegenCounter += unit.HPRegen * 0.1
			const regenAmount = Math.floor(unit.HPRegenCounter)
			unit.HPRegenCounter -= regenAmount
			unit.HPPrediction = Math.max(Math.min(unit.MaxHP, unit.HP + regenAmount), 0)
			if (!unit.IsVisible) {
				unit.HP = unit.HPPrediction
				unit.Mana = Math.max(
					Math.min(
						unit.MaxMana,
						unit.Mana + unit.ManaRegen * Math.min(dt, 0.1)
					),
					0
				)
			}
			if (!unit.IsWaitingToSpawn) {
				unit.PredictedIsWaitingToSpawn = false
			}
			if (unit.IsVisible) {
				unit.PredictedPosition.CopyFrom(unit.NetworkedPosition)
				unit.LastRealPredictedPositionUpdate = GameState.RawGameTime
				unit.LastPredictedPositionUpdate = GameState.RawGameTime
			}
			if (
				unit.NetworkActivity === unit.NetworkActivityPrev &&
				unit.NetworkSequenceIndex === unit.NetworkSequenceIndexPrev &&
				unit.SequenceParity === unit.SequenceParityPrev
			) {
				unit.AnimationTime += dt * unit.PlaybackRate
			} else {
				unit.NetworkActivityStartTime = GameState.RawGameTime
				unit.AnimationTime = unit.StartSequenceCycle
				if (
					unit.NetworkActivity !== unit.NetworkActivityPrev ||
					unit.NetworkSequenceIndex !== unit.NetworkSequenceIndexPrev
				) {
					EventsSDK.emit("NetworkActivityChanged", false, unit)
				}
				if (
					unit.IsInAnimation &&
					(unit.NetworkActivity !== unit.LastActivity ||
						unit.NetworkSequenceIndex !== unit.LastActivitySequenceVariant)
				) {
					EventsSDK.emit("UnitAnimationEnd", false, unit, false)
				}
				unit.NetworkActivityPrev = unit.NetworkActivity
				unit.NetworkSequenceIndexPrev = unit.NetworkSequenceIndex
				unit.SequenceParityPrev = unit.SequenceParity
			}
			if (unit.IsInAnimation && unit.LastAnimationEndTime !== 0) {
				if (
					GameState.RawGameTime > unit.LastAnimationEndTime ||
					Math.abs(GameState.RawGameTime - unit.LastAnimationEndTime) <
						GameState.TickInterval / 10
				) {
					EventsSDK.emit("UnitAnimationEnd", false, unit, false)
				}
			}
			if (unit.IsInAnimation && !unit.LastAnimationCasted) {
				const lastAnimCastPoint =
					unit.LastAnimationStartTime + unit.LastAnimationCastPoint
				if (
					GameState.RawGameTime > lastAnimCastPoint ||
					Math.abs(GameState.RawGameTime - lastAnimCastPoint) <
						GameState.TickInterval / 10
				) {
					unit.LastAnimationCasted = true
					if (unit.LastAnimationIsAttack) {
						const lastAnimServerCastPoint =
							unit.LastAnimationStartTime + unit.LastAnimationCastPoint
						if (
							GameState.RawServerTime <= lastAnimServerCastPoint ||
							Math.abs(GameState.RawServerTime - lastAnimServerCastPoint) <
								GameState.TickInterval / 10
						) {
							unit.AttackTimeAtLastTick = GameState.RawServerTime
							unit.AttackTimeLostToLastTick =
								GameState.RawServerTime -
								(unit.LastAnimationStartTime +
									unit.LastAnimationRawCastPoint)
						}
					}
				}
			}
			let prevPos = unit.PositionHistoryIndex - 1
			if (prevPos < 0) {
				prevPos += unit.PreviousNetworkedAngles_.length
			}
			if (
				prevPos === -1 ||
				unit.PreviousNetworkedAngles_[prevPos] !== unit.NetworkedAngles_.y ||
				unit.PreviousRotationDifference !== unit.RotationDifference
			) {
				const turnData = GetTurnData(unit.TurnRate())
				let rotDiff = unit.RotationDifference
				if (prevPos !== -1) {
					rotDiff += AngleDiff(
						unit.NetworkedAngles_.y,
						unit.PreviousNetworkedAngles_[prevPos]
					)
					if (rotDiff <= -180) {
						rotDiff += 360
					} else if (rotDiff >= 180) {
						rotDiff -= 360
					}
				}
				unit.YawVelocity = UpdateFacing(
					turnData,
					unit.YawVelocity,
					rotDiff,
					dt
				)[1]

				unit.PreviousRotationDifference = unit.RotationDifference
			} else if (unit.RotationDifference === 0) {
				unit.YawVelocity = 0
			}
			if (unit.PreviousNetworkedAngles_.length === 120) {
				unit.PreviousNetworkedAngles_[unit.PositionHistoryIndex] =
					unit.NetworkedAngles_.y
			} else {
				unit.PreviousNetworkedAngles_.push(unit.NetworkedAngles_.y)
			}
			unit.PositionHistoryIndex = (unit.PositionHistoryIndex + 1) % 120
			// TODO: interpolate DeltaZ from OnModifierUpdated?
		}
	}
	protected UnitItemsChanged(unit: Unit) {
		unit.ChangeFieldsByEvents()
	}
	protected PreEntityCreated(entity: Entity) {
		switch (true) {
			// case entity instanceof Item: // owner undefined set in EntityCreated
			// 	this.itemChanged(entity)
			// 	break
			// case entity instanceof Ability: // owner undefined set in EntityCreated
			// 	this.spellChanged(entity)
			// 	break
			case entity instanceof Unit:
				this.unitPredictedPositionChanged(entity)
				break
			case entity instanceof Wearable:
				this.unitWearablesChanged(entity)
				break
			case entity instanceof NeutralSpawner:
				this.unitSpawnerChanged(entity)
				break
		}
	}
	protected EntityCreated(entity: Entity) {
		switch (true) {
			case entity instanceof Item:
				this.itemChanged(entity)
				break
			case entity instanceof Ability:
				this.spellChanged(entity)
				break
		}
	}
	protected EntityDestroyed(entity: Entity) {
		if (entity instanceof Item) {
			this.itemDestroyed(entity)
		}
		if (entity instanceof Ability) {
			this.spellDestroyed(entity)
		}
		if (entity instanceof Wearable) {
			this.wariableDestroyed(entity)
		}
		if (entity instanceof NeutralSpawner) {
			this.unitSpawnerDestroyed(entity)
		}
		if (entity instanceof Unit) {
			this.spawnerUnitDestroyed(entity)
		}
	}
	protected UnitAnimation(
		unit: Unit | FakeUnit,
		sequenceVariant: number,
		playBackRate: number,
		castpoint: number,
		type: number,
		activity: number,
		_lagCompensationTime: number,
		rawCastPoint: number
	) {
		if (unit instanceof FakeUnit || (!unit.IsInAnimation && activity === -1)) {
			return
		}
		unit.IsInAnimation = true
		unit.LastAnimationCasted = false
		if (activity !== -1) {
			unit.LastAnimationIsAttack = type === 0
			unit.LastActivity = activity
			unit.LastActivitySequenceVariant = sequenceVariant
			unit.LastAnimationStartTime = GameState.RawGameTime
		}
		unit.LastAnimationRawCastPoint = rawCastPoint
		unit.LastAnimationCastPoint = castpoint
		unit.LastAnimationPlaybackRate = playBackRate

		const anim = unit.GetAnimation(activity, sequenceVariant, false)
		unit.LastAnimationEndTime =
			anim !== undefined
				? unit.LastAnimationStartTime +
					Math.ceil(
						(unit.LastAnimationPlaybackRate *
							((anim.frameCount - 1) / anim.fps)) /
							GameState.TickInterval +
							1
					) *
						GameState.TickInterval
				: 0
	}
	protected UnitAnimationEnd(unit: Unit | FakeUnit, _snap: boolean) {
		if (unit instanceof FakeUnit || !unit.IsInAnimation) {
			return
		}
		if (unit.LastAnimationIsAttack) {
			const lastAnimCastPoint =
				unit.LastAnimationStartTime + unit.LastAnimationCastPoint
			if (
				GameState.RawGameTime < lastAnimCastPoint &&
				Math.abs(GameState.RawGameTime - lastAnimCastPoint) >
					GameState.TickInterval / 10
			) {
				unit.AttackTimeAtLastTick = 0
				unit.AttackTimeLostToLastTick = 0
			}
		}
		unit.IsInAnimation = false
		unit.LastAnimationIsAttack = false
		unit.LastAnimationCasted = false
		unit.LastActivity = 0 as GameActivity
		unit.LastActivitySequenceVariant = 0
		unit.LastAnimationStartTime = 0
		unit.LastAnimationEndTime = 0
		unit.LastAnimationRawCastPoint = 0
		unit.LastAnimationCastPoint = 0
		unit.LastAnimationPlaybackRate = 0
	}
	protected AbilityHiddenChanged(entity: Ability) {
		const owner = entity.Owner
		if (!(owner instanceof Unit)) {
			return
		}
		if (entity.IsItem) {
			for (let i = 0, end = owner.TotalItems_.length; i < end; i++) {
				if (entity.HandleMatches(owner.TotalItems_[i])) {
					this.slotChanged(entity, i)
					EventsSDK.emit("UnitItemsChanged", false, owner)
					break
				}
			}
			return
		}
		for (let i = 0, end = owner.Spells_.length; i < end; i++) {
			if (entity.HandleMatches(owner.Spells_[i])) {
				this.slotChanged(entity, i)
				EventsSDK.emit("UnitAbilitiesChanged", false, owner)
				break
			}
		}
	}
	protected GameEvent(name: string, obj: IEntityHurt) {
		if (name === "entity_hurt") {
			this.handleAttackedUnits(obj)
		}
	}
	private spellChanged(entity: Ability) {
		if (entity.IsItem) {
			return
		}
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			for (let i = 0, end = unit.Spells_.length; i < end; i++) {
				if (entity.HandleMatches(unit.Spells_[i])) {
					this.setNewProperty(entity, unit, i)
					EventsSDK.emit("UnitAbilitiesChanged", false, unit)
					break
				}
			}
		}
	}
	private itemChanged(entity: Item) {
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			for (let i = 0, end = unit.TotalItems_.length; i < end; i++) {
				if (entity.HandleMatches(unit.TotalItems_[i])) {
					this.setNewProperty(entity, unit, i)
					EventsSDK.emit("UnitItemsChanged", false, unit)
					break
				}
			}
		}
	}
	private unitPredictedPositionChanged(entity: Unit) {
		entity.PredictedPosition.CopyFrom(entity.NetworkedPosition)
		entity.LastRealPredictedPositionUpdate = GameState.RawGameTime
		entity.LastPredictedPositionUpdate = GameState.RawGameTime
	}
	private unitWearablesChanged(entity: Wearable) {
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			for (let i = 0, end = unit.MyWearables_.length; i < end; i++) {
				if (!entity.HandleMatches(unit.MyWearables_[i])) {
					continue
				}
				if (!unit.MyWearables.includes(entity)) {
					unit.MyWearables.push(entity)
					entity.Parent_ = unit.Handle
					const prevParentEnt = entity.ParentEntity
					if (unit !== prevParentEnt) {
						if (prevParentEnt !== undefined) {
							prevParentEnt.Children.remove(entity)
						}
						unit.Children.push(entity)
						entity.ParentEntity = unit
						entity.UpdatePositions()
					}
					EventsSDK.emit("UnitWearablesChanged", false, unit)
					break
				}
			}
		}
	}
	private unitSpawnerChanged(entity: NeutralSpawner) {
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			if (entity.HandleMatches(unit.Spawner_)) {
				unit.Spawner = entity
			}
		}
	}
	private itemDestroyed(entity: Item) {
		const owner = entity.Owner
		if (!(owner instanceof Unit)) {
			return
		}
		for (let i = 0, end = owner.TotalItems.length; i < end; i++) {
			if (entity === owner.TotalItems[i]) {
				owner.TotalItems[i] = undefined
				EventsSDK.emit("UnitItemsChanged", false, owner)
				break
			}
		}
	}
	private spellDestroyed(entity: Ability) {
		if (entity.IsItem) {
			return
		}
		const owner = entity.Owner
		if (!(owner instanceof Unit)) {
			return
		}
		for (let i = 0, end = owner.Spells.length; i < end; i++) {
			if (entity === owner.Spells[i]) {
				owner.Spells[i] = undefined
				EventsSDK.emit("UnitAbilitiesChanged", false, owner)
				break
			}
		}
	}
	private wariableDestroyed(entity: Wearable) {
		const owner = entity.Owner
		if (!(owner instanceof Unit)) {
			return
		}
		if (owner.MyWearables.remove(entity)) {
			EventsSDK.emit("UnitWearablesChanged", false, owner)
		}
	}
	private unitSpawnerDestroyed(entity: NeutralSpawner) {
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			if (entity === unit.Spawner) {
				unit.Spawner = undefined
			}
		}
	}
	private spawnerUnitDestroyed(entity: Unit) {
		for (let i = NeutralSpawners.length - 1; i > -1; i--) {
			const spawner = NeutralSpawners[i]
			if (entity.Spawner === spawner) {
				entity.Spawner = undefined
			}
		}
	}
	// hack workaround owner abilities
	private setNewProperty(entity: Item | Ability, unit: Unit, arrIndex: number) {
		entity.Owner_ = unit.Handle
		entity.OwnerEntity = unit
		entity.Prediction = new Prediction() as any // TODO
		if (!(entity instanceof Item)) {
			unit.Spells[arrIndex] = entity
			this.slotChanged(entity, arrIndex)
			return
		}
		this.slotChanged(entity, arrIndex)
		unit.TotalItems[arrIndex] = entity
	}
	private slotChanged(entity: Ability, arrIndex: number) {
		if (entity instanceof Item) {
			entity.ItemSlot = arrIndex
			return
		}
		entity.AbilitySlot = entity.IsHidden
			? EAbilitySlot.DOTA_SPELL_SLOT_HIDDEN
			: arrIndex
	}
	private handleAttackedUnits(obj: IEntityHurt) {
		const victim = EntityManager.EntityByIndex(obj.entindex_killed),
			target = EntityManager.EntityByIndex(obj.entindex_attacker)
		if (!(victim instanceof Unit) || !(target instanceof Unit)) {
			return
		}
		if (this.excludeAttacked(victim) || this.excludeAttacked(target)) {
			return
		}
		// TODO: handle is teleported
		if (victim.IsVisible || target.IsVisible || !victim.IsAlive || !target.IsAlive) {
			return
		}
		if (!victim.IsIllusion && !target.IsIllusion) {
			target.PredictedPosition.CopyFrom(victim.Position)
			target.LastPredictedPositionUpdate = GameState.RawGameTime
			victim.PredictedPosition.CopyFrom(target.Position)
			victim.LastPredictedPositionUpdate = GameState.RawGameTime
		}
	}
	private excludeAttacked(source: Unit) {
		return (
			source.IsRoshan ||
			source instanceof Miniboss ||
			source instanceof npc_dota_hero_wisp
		)
	}
})()
