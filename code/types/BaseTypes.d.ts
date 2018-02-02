declare interface KeyValueObject<T = any> {
	[key: string]: T
}

declare interface EmptyObject { }

declare type unset = null | undefined;
