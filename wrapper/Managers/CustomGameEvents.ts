import { Player } from "../Objects/Base/Player"
import { BinaryKV, serializeVBKV } from "../Utils/VBKV"

export function FireEventToClient(name: string, player: Player, data: Map<string, BinaryKV>): void {
	CustomGameEvents.FireEventToClient(name, player.Index, serializeVBKV(data))
}

export function FireEventToAllClients(name: string, data: Map<string, BinaryKV>): void {
	CustomGameEvents.FireEventToAllClients(name, serializeVBKV(data))
}

export function FireEventToServer(name: string, data: Map<string, BinaryKV>): void {
	CustomGameEvents.FireEventToServer(name, serializeVBKV(data))
}
