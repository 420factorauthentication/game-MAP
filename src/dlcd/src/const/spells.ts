/** @format */

import {MinionManager} from "../../../lib-pvz/types";
import {RollbarOption} from "../../../lib-hotbar/types";

// import {baseFX, maskFX} from "../func/fx.js";
import {vfx, transitionVFX} from "../../../lib-vfx/vfx.js";

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
            vfx(
                {rect: target.elem.getBoundingClientRect(), zIndex: 4},
                550,
                {},
                "../lib-svg/anim/hitblood_0.svg"
            );
            transitionVFX(
                {rect: target.elem.getBoundingClientRect(), zIndex: 3},
                400,
                {
                    backgroundColor: "white",
                    maskImage: "url('assets/art/sprite-zombro.svg')",
                    maskRepeat: "no-repeat",
                    maskSize: "100% 100%",
                },
                {backgroundColor: "transparent"}
            );

            // Damage
            target.changeHp(-1);
        };
    },
    styleCssText: "background-color: rgba(169, 69, 42, 169);",
    innerHTML: "Sword of Semver",
    tooltip: "Deal 3 damage to front minion.",
    flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
};
