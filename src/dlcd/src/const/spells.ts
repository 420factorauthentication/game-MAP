/** @format */

import {MinionManager} from "../../../lib-pvz/types";
import {RollbarOption} from "../../../lib-hotbar/types";

import {baseFX, maskFX} from "../fx.js";

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
            let target = manager.minionsSortX[0];
            if (!target) return;

            // FX: flash white and blood hit
            baseFX(target.elem, "../lib-svg/anim/hitblood_0.svg", 550);
            maskFX(target.elem, "assets/art/sprite-zombro.svg", 400, {
                color: "white",
                transitionDur: "0.35s",
            });

            // Damage
            target.changeHp(-1);
        };
    },
    styleCssText: "background-color: rgba(169, 69, 42, 169);",
    innerHTML: "Sword of Semver",
    tooltip: "Deal 3 damage to front minion.",
    flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
};
