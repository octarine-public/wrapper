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

  removeAllListeners() {
    let _a = Object.keys(this.events);

    let _f = name => {
      return this.events[name].splice(0);
    };

    for (let _i = _a.length; _i--;) {
      _f(_a[_i], _i, _a);
    }

    return this;
  }

  emit(name, cancellable, ...args) {
    let listeners = this.events[name];

    if (listeners === undefined) {
      return true;
    }

    return !listeners.some(listener => {
      return listener.apply(this, args) === false && cancellable;
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
  setTimeout(Math.max(1000 / 30, GetLatency(Flow_t.IN)), () => {
    if (IsInGame() && LocalDOTAPlayer !== undefined) {
      try {
        Events.emit("onTick", false);
      } catch (e) {
        onTick();
        throw e;
      }
    }

    onTick();
  });
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
    if (ent.m_iszUnitName === undefined) {
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

    if (npc.m_iszUnitName !== undefined) {
      Events.emit("onNPCCreated", false, npc);
      NPCs.splice(i--, 1);
      end--;
    }
  }
});
