/**
 * Ensure React types (including global JSX.IntrinsicElements) are loaded.
 * Augment the 'react' module so that named imports work when types use export = React.
 */
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "react" {
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];
  export function useEffect(effect: () => void | (() => void), deps?: React.DependencyList): void;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(initialValue?: T): React.MutableRefObject<T | undefined>;
  export function useCallback<T extends (...args: never[]) => unknown>(callback: T, deps: React.DependencyList): T;
  export function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function useContext<T>(context: React.Context<T>): T;
  export const Suspense: React.ExoticComponent<{ children?: React.ReactNode; fallback?: React.ReactNode }>;
  export type ChangeEvent<T extends EventTarget = EventTarget> = React.ChangeEvent<T>;
}
