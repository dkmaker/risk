/**
 * Utility types for Risk Dice Battle
 *
 * This file defines utility types, helper types, and common patterns
 * used throughout the application for type safety and consistency.
 */

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make specific properties optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extract specific properties from type
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omit specific properties from type
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Create a type with readonly properties
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Create a type with mutable properties
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Non-nullable type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Maybe type (can be undefined)
 */
export type Maybe<T> = T | undefined;

/**
 * Union to intersection type
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Extract function parameters
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

/**
 * Extract function return type
 */
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;

/**
 * Promise type extraction
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Array element type
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Object values type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Object keys type
 */
export type KeyOf<T> = keyof T;

/**
 * Flatten nested objects
 */
export type Flatten<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

/**
 * Brand type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * ID types for different entities
 */
export type PlayerId = Brand<string, "PlayerId">;
export type GameId = Brand<string, "GameId">;
export type BattleId = Brand<string, "BattleId">;
export type TransactionId = Brand<string, "TransactionId">;

/**
 * Timestamp type
 */
export type Timestamp = Brand<number, "Timestamp">;

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Either type for representing one of two possible values
 */
export type Either<L, R> = { kind: "left"; value: L } | { kind: "right"; value: R };

/**
 * Option type for representing optional values
 */
export type Option<T> = { kind: "some"; value: T } | { kind: "none" };

/**
 * State machine states
 */
export type State<S extends string, D = {}> = {
  state: S;
  data: D;
};

/**
 * Action type for state management
 */
export type Action<T extends string, P = {}> = {
  type: T;
  payload: P;
};

/**
 * Reducer type
 */
export type Reducer<S, A> = (state: S, action: A) => S;

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Callback function types
 */
export type Callback<T = void> = (value: T) => void;
export type AsyncCallback<T = void> = (value: T) => Promise<void>;
export type ErrorCallback = (error: Error) => void;

/**
 * Event emitter types
 */
export type EventMap = Record<string, any>;
export type EventHandler<T = any> = (event: T) => void;
export type EventEmitter<T extends EventMap> = {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
};

/**
 * Serializable types (for storage)
 */
export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: Serializable }
  | Serializable[];

/**
 * JSON-compatible types
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

/**
 * Constructor type
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

/**
 * Mixin type
 */
export type Mixin<T> = Constructor<T>;

/**
 * Class decorator type
 */
export type ClassDecorator = <T extends Constructor>(target: T) => T | undefined;

/**
 * Method decorator type
 */
export type MethodDecorator = <T>(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | undefined;

/**
 * Property decorator type
 */
export type PropertyDecorator = (target: any, propertyKey: string | symbol) => void;

/**
 * Parameter decorator type
 */
export type ParameterDecorator = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number
) => void;

/**
 * Predicate function type
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator function type
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Transformer function type
 */
export type Transformer<T, U> = (value: T) => U;

/**
 * Mapper function type
 */
export type Mapper<T, U> = (value: T, index: number) => U;

/**
 * Filter function type
 */
export type Filter<T> = (value: T, index: number) => boolean;

/**
 * Reducer function type
 */
export type ReducerFunction<T, U> = (accumulator: U, current: T, index: number) => U;

/**
 * Validation function type
 */
export type Validator<T> = (value: T) => boolean | string;

/**
 * Type guard function type
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Disposable interface
 */
export interface Disposable {
  dispose(): void;
}

/**
 * Async disposable interface
 */
export interface AsyncDisposable {
  dispose(): Promise<void>;
}

/**
 * Observable interface
 */
export interface Observable<T> {
  subscribe(observer: (value: T) => void): () => void;
}

/**
 * Subject interface
 */
export interface Subject<T> extends Observable<T> {
  next(value: T): void;
  complete(): void;
  error(error: Error): void;
}

/**
 * Deferred interface
 */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve(value: T): void;
  reject(error: Error): void;
}

/**
 * Cache interface
 */
export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size(): number;
}

/**
 * Pool interface
 */
export interface Pool<T> {
  acquire(): T | undefined;
  release(item: T): void;
  size(): number;
  available(): number;
}

/**
 * Registry interface
 */
export interface Registry<K, V> {
  register(key: K, value: V): void;
  unregister(key: K): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  keys(): K[];
  values(): V[];
  entries(): [K, V][];
}

/**
 * Factory interface
 */
export interface Factory<T> {
  create(...args: any[]): T;
}

/**
 * Builder interface
 */
export interface Builder<T> {
  build(): T;
}

/**
 * Cloneable interface
 */
export interface Cloneable<T> {
  clone(): T;
}

/**
 * Equatable interface
 */
export interface Equatable<T> {
  equals(other: T): boolean;
}

/**
 * Comparable interface
 */
export interface Comparable<T> {
  compareTo(other: T): number;
}

/**
 * Hashable interface
 */
export interface Hashable {
  hashCode(): number;
}

/**
 * Serializable interface
 */
export interface SerializableObject<T> {
  serialize(): Serializable;
  deserialize(data: Serializable): T;
}

/**
 * Utility helper functions as types
 */
export type UtilityHelpers = {
  isNil: <T>(value: T | null | undefined) => value is null | undefined;
  isNotNil: <T>(value: T | null | undefined) => value is T;
  isDefined: <T>(value: T | undefined) => value is T;
  isUndefined: (value: any) => value is undefined;
  isNull: (value: any) => value is null;
  isNumber: (value: any) => value is number;
  isString: (value: any) => value is string;
  isBoolean: (value: any) => value is boolean;
  isObject: (value: any) => value is object;
  isArray: (value: any) => value is any[];
  isFunction: (value: any) => value is Function;
  isPromise: (value: any) => value is Promise<any>;
  isError: (value: any) => value is Error;
  isEmpty: (value: any) => boolean;
  isEqual: <T>(a: T, b: T) => boolean;
  clone: <T>(value: T) => T;
  merge: <T extends object>(target: T, ...sources: Partial<T>[]) => T;
  pick: <T, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
  omit: <T, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number) => T;
  throttle: <T extends (...args: any[]) => any>(fn: T, delay: number) => T;
  once: <T extends (...args: any[]) => any>(fn: T) => T;
  memoize: <T extends (...args: any[]) => any>(fn: T) => T;
  pipe: <T>(...fns: Array<(arg: T) => T>) => (value: T) => T;
  compose: <T>(...fns: Array<(arg: T) => T>) => (value: T) => T;
  curry: <T extends (...args: any[]) => any>(fn: T) => any;
  partial: <T extends (...args: any[]) => any>(fn: T, ...args: any[]) => any;
  identity: <T>(value: T) => T;
  constant: <T>(value: T) => () => T;
  noop: () => void;
  times: <T>(n: number, fn: (index: number) => T) => T[];
  range: (start: number, end: number, step?: number) => number[];
  random: (min: number, max: number) => number;
  shuffle: <T>(array: T[]) => T[];
  sample: <T>(array: T[]) => T | undefined;
  unique: <T>(array: T[]) => T[];
  groupBy: <T, K extends PropertyKey>(array: T[], key: (item: T) => K) => Record<K, T[]>;
  sortBy: <T>(array: T[], key: (item: T) => any) => T[];
  chunk: <T>(array: T[], size: number) => T[][];
  flatten: <T>(array: (T | T[])[]) => T[];
  zip: <T, U>(a: T[], b: U[]) => [T, U][];
  unzip: <T, U>(array: [T, U][]) => [T[], U[]];
  intersection: <T>(a: T[], b: T[]) => T[];
  union: <T>(a: T[], b: T[]) => T[];
  difference: <T>(a: T[], b: T[]) => T[];
  delay: (ms: number) => Promise<void>;
  timeout: <T>(promise: Promise<T>, ms: number) => Promise<T>;
  retry: <T>(fn: () => Promise<T>, attempts: number) => Promise<T>;
  sequence: <T>(promises: Array<() => Promise<T>>) => Promise<T[]>;
  parallel: <T>(promises: Promise<T>[]) => Promise<T[]>;
  race: <T>(promises: Promise<T>[]) => Promise<T>;
  allSettled: <T>(
    promises: Promise<T>[]
  ) => Promise<Array<{ status: "fulfilled" | "rejected"; value?: T; reason?: any }>>;
};
