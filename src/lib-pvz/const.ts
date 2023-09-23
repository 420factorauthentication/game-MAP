/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** An enum describing all Minion gameplay number stats with getters. */
export const MinionStats = {
    hp: "hp",
    movSpd: "movSpd",
    atkSpd: "atkSpd",
    atkDmg: "atkDmg",
} as const;

/** An enum desecribing all Minion CSS Unit Values. */
export const MinionSizes = {
    width: "width",
    height: "height",
} as const;

/** An enum describing all Minion HTML attribute strings. */
export const MinionArts = {
    spriteURL: "spriteURL",
} as const;

/** An enum describing all optional Minion HTML attribute strings. */
export const MinionConfigs = {
    extraClasses: "extraClasses",
} as const;
