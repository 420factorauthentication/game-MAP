import { MinionManager } from "../../lib-pvz/types";


///////////////////////////////////////
// Template for designing new Spells //
///////////////////////////////////////
export type Spell = Readonly<{

    // Generates a Spell function at runtime,
    // using the MinionManager to find targets.
    // This func is assigned to HotbarButton.onPress
    func (manager: MinionManager): () => void;

    // Generates a new HTMLElement at runtime,
    // with the desired style for a HotbarButton
    get elem(): HTMLElement;
}>;


/////////////
// DEFAULT //
/////////////
export const Default: Spell = {
    func() {return () => {}},

    get elem() {
        const newElem = <HTMLElement> document.createElement("a");
        newElem.style.display = "block";
        newElem.style.boxSizing = "border-box";
        // newElem.style.background = "content-box radial-gradient(slategray, gray)";
        newElem.style.border = "2px solid black";
        newElem.style.fontSize = "16px";
        newElem.style.textAlign = "center";
        newElem.style.lineHeight = "15vh";  //center vertically (one line only)
        return newElem;
    }
};

////////////////////////////////////////////
// SWORD SPELL                            //
//   Deal 3 damage to front minion.       //
// FLAVOR TEXT                            //
//   It'll give you major and minor cuts. //
//   You'll need to patch yourself up.    //
////////////////////////////////////////////
export const Sword: Spell = {
    func (manager) {
        return () => {manager.minionsSortX[0].changeHp(-3);}
    },

    get elem() {
        const newElem = Default.elem;
        newElem.style.background = "rgba(169, 69, 42, 169)";
        newElem.innerHTML = "Sword of Semver";
        return newElem;
    }
};
