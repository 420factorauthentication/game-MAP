import { MinionManager } from "../../lib-pvz/types";


export type Spell = () => void;
export type GetSpell = (manager: MinionManager) => Spell;

// SWORD SPELL: deal 3 damage to first minion //
export const getSwordSpell: GetSpell = (manager: MinionManager) => {
    return () => {manager.minions[0].changeHp(-3);}
}
