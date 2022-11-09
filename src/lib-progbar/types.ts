/** @format */

////////////////////////////////////////////////////////////////////////////////

export const Flow = {leftToRight: 0, btmToTop: 1} as const;
export type ProgBarFlow = typeof Flow[keyof typeof Flow];
