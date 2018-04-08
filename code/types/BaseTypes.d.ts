declare interface KeyValueObject<T = any> {
	[key: string]: T
}

declare interface EmptyObject { }

declare type unset = null | undefined;

interface ObjectConstructor {
	keys<T>(obj: T): (keyof T)[];
	values<T>(obj: T): (T[keyof T])[];
}

type ObjectValueMap<K, V, T extends keyof K = keyof K> = {
	[P in T]: V;
}
