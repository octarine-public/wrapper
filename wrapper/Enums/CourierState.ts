export const enum CourierState {
	COURIER_STATE_INIT = -1,
	COURIER_STATE_IDLE = 0,
	COURIER_STATE_AT_BASE = 1,
	COURIER_STATE_MOVING = 2,
	COURIER_STATE_DELIVERING_ITEMS = 3,
	COURIER_STATE_RETURNING_TO_BASE = 4,
	COURIER_STATE_DEAD = 5,
	COURIER_NUM_STATES = 6
}
