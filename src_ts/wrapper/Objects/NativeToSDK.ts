let constructors = new Map<string, any>()

export function RegisterClass(name: string, constructor: any) {
	constructors.set(name, constructor)
}

export default function GetConstructor(name: string) {
	return constructors.get(name)
}
