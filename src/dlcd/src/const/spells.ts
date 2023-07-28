/** @format */

import {MinionManager} from "../../../lib-pvz/types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Template for designing new Spells. */
export type Spell = Readonly<{
    /**
     * Generates a Spell function at runtime, used for HotbarButton.onPress.
     * @param manager Used to find targets for the Spell function.
     */
    func(manager: MinionManager): () => void;

    /** The style applied to the new DOM Element generated for the HotbarButton. */
    styleCssText?: string;

    /** The inner HTML applied to the new DOM Element generated for the HotbarButton. */
    innerHTML?: string;
}>;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Spell defaults. */
export const Default: Spell = {
    func() {
        return () => {};
    },

    styleCssText:
        "display: block; " +
        "box-sizing: border-box; " +
        // "background: content-box radial-gradient(slategray, gray); " +
        "border: 2px soliid black; " +
        "font-size: 16px; " +
        "text-align: center; " +
        "line-height: 15vh; ", // center vertically (one line only)

    innerHTML: "New Spell",
};

/**
 * SWORD SPELL:
 * Deal 3 damage to front minion.
 *
 * FLAVOR TEXT:
 * It'll give you major and minor cuts.
 * You'll need to patch yourself up.
 */
export const Sword: Spell = {
    func(manager) {
        return () => {
            manager.minionsSortX[0]?.changeHp(-3);
        };
    },

    styleCssText: Default.styleCssText + "background: rgba(169, 69, 42, 169)",

    innerHTML: "Sword of Semver",
};
