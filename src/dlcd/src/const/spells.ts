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
            let imgNode = document.createElement("img");
            document.body.append(imgNode);
            imgNode.src = "../lib-svg/anim/hitblood0.svg";
            imgNode.style.zIndex = "3";
            imgNode.style.width = target.elem.style.width;
            imgNode.style.height = target.elem.style.height;
            imgNode.style.position = target.elem.style.position;
            imgNode.style.top = target.elem.style.top;
            imgNode.style.right = target.elem.style.right;
            imgNode.style.bottom = target.elem.style.bottom;
            imgNode.style.left = target.elem.style.left;

            setTimeout(() => {
                document.body.removeChild(imgNode);
            }, 550);

            // Damage
            target.changeHp(-3);
        };
    },
    styleCssText: "background-color: rgba(169, 69, 42, 169);",
    innerHTML: "Sword of Semver",
    tooltip: "Deal 3 damage to front minion.",
    flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
};
