/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** An option in the options menu. */
export type Option<t> = {
    readonly id: string;
    readonly default: t;
    current?: t;
};

// ====================================================== //
// ======================= HOTKEYS ====================== //
// ====================================================== //

export namespace SpellKeys {
    export const Cast0: Option<string> = {
        id: "spellKey0",
        default: "Q",
    };
    export const Cast1: Option<string> = {
        id: "spellKey1",
        default: "W",
    };
    export const Cast2: Option<string> = {
        id: "spellKey2",
        default: "E",
    };
    export const Cast3: Option<string> = {
        id: "spellKey3",
        default: "R",
    };
}
