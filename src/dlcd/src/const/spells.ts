/** @format */

import type {MinionSpawner} from "../../../lib-pvz/spawner";
import type {ResourceManager} from "../lib/resource";
import {RollbarOption} from "../../../lib-hotbar/types";

import {ZLayerFxFlash, ZLayerFxParticles} from "../const/game.js";

import {vfx, transitionVFX} from "../../../lib-vfx/vfx.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type Spell = Readonly<
    Omit<RollbarOption, "onPress"> & {
        /**
         * A decorated function that caches a MinionSpawner.
         * Returns a function for HotbarButton.onPress.
         * @param spawner Used to find targets for the function.
         */
        getOnPress(spawner: MinionSpawner): () => void;
        /**
         * A decorated function that caches a ResourceManager.
         * Returns a function for HotbarButton.conditions.
         * @param manager Used to manage resource checks and costs in the function.
         */
        getCondition?(manager: ResourceManager): () => boolean;
    }
>;

// ====================================================== //
// ======================= SPELLS ======================= //
// ====================================================== //

export const Sword: Spell = {
    getOnPress(spawner) {
        return () => {
            let target = spawner.minionsSortX[0];
            if (!target) return;

            // FX: blood particles
            vfx(
                550,
                {
                    rect: target.minionElem.getBoundingClientRect(),
                    zIndex: ZLayerFxParticles,
                },
                {},
                "../lib-svg/anim/hitblood_0.svg"
            );

            // FX: flash white
            transitionVFX(
                400,
                {
                    rect: target.minionElem.getBoundingClientRect(),
                    zIndex: ZLayerFxFlash,
                },
                {
                    backgroundColor: "white",
                    maskImage: `url("${target.spriteURL}")`,
                    maskRepeat: "no-repeat",
                    maskSize: "100% 100%",
                },
                {backgroundColor: "transparent"}
            );

            // Damage
            target.change("hp", -1);
        };
    },
    styleCssText: "background-color: rgba(169, 69, 42, 169);",
    innerHTML: "Sword of Semver",
    tooltip: "Deal 3 damage to front minion.",
    flavor: "It'll give you major and minor cuts. You'll need to patch yourself up.",
};
