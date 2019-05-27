global.EventEmitter = class EventEmitter {
  events = {};

  on(name, listener) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      this.events[name] = listeners = [];
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
    let listeners = this.events[name];

    if (listeners === undefined) {
      return true;
    }

    return !listeners.some(listener => {
      try {
        return listener.apply(this, args) === false && cancellable;
      } catch (e) {
        console.log(e.stack);
        return false;
      }
    });
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

(function onTick() {
  setTimeout(() => {
    if (IsInGame() && LocalDOTAPlayerID !== -1) {
      try {
        Events.emit("onTick", false);
      } catch (e) {
        onTick();
        throw e;
      }
    }

    onTick();
  }, Math.max(1000 / 30, GetLatency(Flow_t.IN)));
})();

let AllEntities = [],
    EntitiesIDs = [],
    NPCs = [];
global.Entities = new class Entities {
  get AllEntities() {
    return AllEntities;
  }

  get EntitiesIDs() {
    return EntitiesIDs;
  }

  GetEntityID(ent) {
    return EntitiesIDs.indexOf(ent);
  }

  GetEntityByID(id) {
    return EntitiesIDs[id];
  }

}();
Events.on("onEntityCreated", (ent, id) => {
  AllEntities.push(ent);
  EntitiesIDs[id] = ent;

  if (ent instanceof C_DOTA_BaseNPC) {
    if ((ent.m_pEntity.m_flags & 1 << 2) !== 0) {
      NPCs.push(ent);
    } else Events.emit("onNPCCreated", false, ent);
  }
});
Events.on("onEntityDestroyed", (ent, id) => {
  AllEntities.splice(AllEntities.indexOf(ent), 1);
  delete EntitiesIDs[id];

  if (ent instanceof C_DOTA_BaseNPC) {
    const NPCs_id = NPCs.indexOf(ent);

    if (NPCs_id !== -1) {
      NPCs.splice(NPCs_id, 1);
    }
  }
});
Events.on("onTick", () => {
  for (let i = 0, end = NPCs.length; i < end; i++) {
    let npc = NPCs[i];

    if ((npc.m_pEntity.m_flags & 1 << 2) === 0) {
      Events.emit("onNPCCreated", false, npc);
      NPCs.splice(i--, 1);
      end--;
    }
  }
});
