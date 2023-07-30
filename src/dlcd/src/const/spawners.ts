/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type SpawnDistance = {
    minX: number;
    maxX: number;
};

export type SpawnSpread = {
    minY: number;
    maxY: number;
};

export type SpawnZone = SpawnDistance & SpawnSpread;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const Far: SpawnDistance = {
    minX: 75,
    maxX: 80,
};
export const Mid: SpawnDistance = {
    minX: 50,
    maxX: 80,
};
export const Near: SpawnDistance = {
    minX: 30,
    maxX: 50,
};
export const Close: SpawnDistance = {
    minX: 25,
    maxX: 30,
};

export const Wide: SpawnSpread = {
    minY: 30,
    maxY: 70,
};
export const Med: SpawnSpread = {
    minY: 40,
    maxY: 60,
};
export const Thin: SpawnSpread = {
    minY: 50,
    maxY: 50,
};
