import { MinionManager } from "../../lib-pvz/types";


// A function assigned to HotbarButton.onPress
export type Spell = () => void;

// Generates a Spell function at runtime
export type GetSpell = (manager: MinionManager) => Spell;


// Generates a HotbarButton elem with the desired style
export type GetSpellElem = () => HTMLElement;

// Default HotbarButton elem
const getDefaultElem: GetSpellElem = () => {
    const elem = <HTMLElement> document.createElement("a");
    elem.style.display = "block";
    elem.style.boxSizing = "border-box";
    // elem.style.background = "content-box radial-gradient(slategray, gray)";
    elem.style.border = "2px solid black";
    elem.style.fontSize = "16px";
    elem.style.textAlign = "center";
    elem.style.lineHeight = "15vh";  //center vertically (one line only)
    return elem;
}



// SWORD SPELL: deal 3 damage to front minion //
export const getSwordSpell: GetSpell = (manager: MinionManager) => {
    return () => {manager.minionsSortedByX[0].changeHp(-3);}
}
export const getSwordElem: GetSpellElem = () => {
    const elem = getDefaultElem();
    elem.style.background = "rgba(169, 69, 42, 169)";
    elem.innerHTML = "Sword of Semantics";
    return elem;
}
