export const enum EventPriority {
	LOW = -1,
	NORMAL = -2,
	HIGH = -(2 ** 53 - 2), // use in internal wrapper
	IMMEDIATE = -(2 ** 53 - 1) // use in wrapper
}
