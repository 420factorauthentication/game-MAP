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
            let target = manager.minionsSortX[0];
            if (!target) return;

            // Blood hit fx
            let imgBlood = document.createElement("img");
            document.body.append(imgBlood);
            imgBlood.src = "../lib-svg/anim/hitblood_0.svg";
            imgBlood.style.zIndex = "3";
            imgBlood.style.width = target.elem.style.width;
            imgBlood.style.height = target.elem.style.height;
            imgBlood.style.position = target.elem.style.position;
            imgBlood.style.top = target.elem.style.top;
            imgBlood.style.right = target.elem.style.right;
            imgBlood.style.bottom = target.elem.style.bottom;
            imgBlood.style.left = target.elem.style.left;
            setTimeout(() => {
                document.body.removeChild(imgBlood);
            }, 550);

            // Flash white fx

            // Damage
            target.changeHp(-1);
        };
    },
    styleCssText: "background-color: rgba(169, 69, 42, 169);",
    innerHTML: "Sword of Semver",
    tooltip: "Deal 3 damage to front minion.",
    flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
};
