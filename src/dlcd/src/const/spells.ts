/** @format */

import {MinionManager} from "../../../lib-pvz/types";
import {RollbarOption} from "../../../lib-hotbar/types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type Spell = Readonly<
    Omit<RollbarOption, "onPress"> & {
        /**
         * Generates a Spell function for HotbarButton.onPress,
         * at runtime so you have access to a MinionManager.
         * @param manager Used to find targets for the Spell function.
         */
        func(manager: MinionManager): () => void;
    }
>;

// ====================================================== //
// ======================= SPELLS ======================= //
// ====================================================== //

export const Sword: Spell = {
    func(manager) {
        return () => {
            manager.minionsSortX[0]?.changeHp(-3);
        };
    },
    // styleCssText: "background: rgba(169, 69, 42, 169);",
    innerHTML: "Sword of Semver",
    tooltip: "Deal 3 damage to front minion.",
    flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
};
