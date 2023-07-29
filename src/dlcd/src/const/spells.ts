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
    /** Description text to show when cursor hovers over HotbarButton. */
    tooltip?: string;
    /** Flavor text to show in expanded menus. */
    flavor?: string;
}>;

// ====================================================== //
// ======================= SPELLS ======================= //
// ====================================================== //

export namespace MeleeSpells {
    export const Sword: Spell = {
        func(manager) {
            return () => {
                manager.minionsSortX[0]?.changeHp(-3);
            };
        },
        styleCssText: "background: rgba(169, 69, 42, 169);",
        innerHTML: "Sword of Semver",
        tooltip: "Deal 3 damage to front minion.",
        flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
    };
}
