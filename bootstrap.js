global.EventEmitter = class EventEmitter {
  events = {};
  events_after = {};

  on(name, listener) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      this.events[name] = listeners = [];
    }

    listeners.push(listener);
    return this;
  }

  after(name, listener) {
    let listeners = this.events_after[name];

    if (listeners === undefined) {
      this.events_after[name] = listeners = [];
    }

    listeners.push(listener);
    return this;
  }

  removeListener(name, listener) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      return;
    }

    const idx = listeners.indexOf(listener);

    if (idx > -1) {
      listeners.splice(idx, 1);
    }

    return this;
  }

  emit(name, cancellable = false, ...args) {
    let listeners = this.events[name],
        listeners_after = this.events_after[name];
    let ret = listeners === undefined || !listeners.some(listener => {
      try {
        return listener.apply(this, args) === false && cancellable;
      } catch (e) {
        console.log(e.stack || new Error(e).stack);
        return false;
      }
    });

    if (listeners_after !== undefined) {
      let _a = listeners_after;

      let _f = listener => {
        try {
          listener.apply(this, args);
        } catch (e) {
          console.log(e.stack || new Error(e).stack);
        }
      };

      for (let _i = _a.length; _i--;) {
        _f(_a[_i], _i, _a);
      }
    }

    return ret;
  }

  once(name, listener) {
    const once_listener = (...args) => {
      this.removeListener(name, once_listener);
      listener(...args);
    };

    return this.on(name, once_listener);
  }

};
global.Events = new EventEmitter();
setFireEvent((name, cancellable, ...args) => {
  return Events.emit(name, cancellable, ...args);
});
setInterval(() => {
  try {
    if (IsInGame()) {
      Events.emit("Tick", false);
    }
  } catch (e) {
    throw e;
  }
}, Math.max(GetLatency(Flow_t.IN) * 1000, 1000 / 30));
let NPCs = [];
global.Entities = new class EntityManager {
  AllEntities = [];
  EntitiesIDs = [];

  GetEntityID(ent) {
    return this.EntitiesIDs.indexOf(ent);
  }

  GetEntityByID(id) {
    return this.EntitiesIDs[id];
  }

}();
Events.on("EntityCreated", (ent, id) => {
  Entities.AllEntities.push(ent);
  Entities.EntitiesIDs[id] = ent;

  if (ent instanceof C_DOTA_BaseNPC) {
    if ((ent.m_pEntity.m_flags & 1 << 2) !== 0) {
      NPCs.push(ent);
    } else Events.emit("NPCCreated", false, ent);
  }
});
Events.on("EntityDestroyed", (ent, id) => {
  Entities.AllEntities.splice(Entities.AllEntities.indexOf(ent), 1);
  delete Entities.EntitiesIDs[id];

  if (ent instanceof C_DOTA_BaseNPC) {
    const NPCs_id = NPCs.indexOf(ent);

    if (NPCs_id !== -1) {
      NPCs.splice(NPCs_id, 1);
    }
  }
});
Events.on("Tick", () => {
  for (let i = 0, end = NPCs.length; i < end; i++) {
    let npc = NPCs[i];

    if ((npc.m_pEntity.m_flags & 1 << 2) === 0) {
      Events.emit("NPCCreated", false, npc);
      NPCs.splice(i--, 1);
      end--;
    }
  }
});
Events.on("TeamVisibilityChanged", (npc, newTagged) => {
  return npc.m_iTaggedAsVisibleByTeam = newTagged;
});
