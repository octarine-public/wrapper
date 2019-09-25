class Damage {
	public GetSpellDamage(damage: number, amplify: number = 0, reduction: number = 0): number {
		return damage * (1 + amplify) * (1 - reduction)
	}

	// public GetSpellDamageModifier(damage: number, ...modifiers: number[]) {
	// 	let amplify = 1;
	// 	for (let modifier = 0; modifier < modifiers.length; modifier++) {
	// 		amplify *= 1 + modifier;
	// 		return damage * amplify;
	// 	}
	// }
}
