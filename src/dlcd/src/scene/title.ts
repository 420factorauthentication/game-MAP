/** @format */

import {Scene} from "./types";

import GameScene from "./game.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
export interface _TitleScene extends Scene {
    /** SVG title text. */
    title?: HTMLElement;
    /** SVG art. */
    menuArt?: HTMLElement;
    /** SVG animated space bg. */
    menuBG?: HTMLElement;
    /** Continue button. */
    btnContinue?: HTMLElement;
    /** New Game button. */
    btnNewGame?: HTMLElement;
    /** Load Game button. */
    btnLoad?: HTMLElement;
    /** Options button. */
    btnOptions?: HTMLElement;
    /** Exit to Desktop button. */
    btnExit?: HTMLElement;
    /** Is the screen currently fading to black? Happens after clicking a button. */
    isFading?: boolean;
}

////////////////////////////////////////////////////////////////////////////////

export const TitleScene: _TitleScene = {
    activate() {
        // Don't allow multiple instances of the same Scene to be active at once
        if (TitleScene.isActive) return;
        TitleScene.isActive = true;

        // Create HTMLElements
        TitleScene.title = <HTMLElement>document.createElement("div");
        TitleScene.menuArt = <HTMLElement>document.createElement("div");
        TitleScene.menuBG = <HTMLElement>document.createElement("div");
        TitleScene.btnContinue = <HTMLElement>document.createElement("button");
        TitleScene.btnNewGame = <HTMLElement>document.createElement("button");
        TitleScene.btnLoad = <HTMLElement>document.createElement("button");
        TitleScene.btnOptions = <HTMLElement>document.createElement("button");
        TitleScene.btnExit = <HTMLElement>document.createElement("button");

        document.body.appendChild(TitleScene.title);
        document.body.appendChild(TitleScene.menuArt);
        document.body.appendChild(TitleScene.menuBG);
        document.body.appendChild(TitleScene.btnContinue);
        document.body.appendChild(TitleScene.btnNewGame);
        document.body.appendChild(TitleScene.btnLoad);
        document.body.appendChild(TitleScene.btnOptions);
        document.body.appendChild(TitleScene.btnExit);

        TitleScene.title.id = "title";
        TitleScene.menuArt.id = "menuArt";
        TitleScene.menuBG.id = "menuBG";
        TitleScene.btnContinue.id = "btnContinue";
        TitleScene.btnNewGame.id = "btnNewGame";
        TitleScene.btnLoad.id = "btnLoad";
        TitleScene.btnOptions.id = "btnOptions";
        TitleScene.btnExit.id = "btnExit";

        TitleScene.btnContinue.className = "mmButton";
        TitleScene.btnNewGame.className = "mmButton";
        TitleScene.btnLoad.className = "mmButton";
        TitleScene.btnOptions.className = "mmButton";
        TitleScene.btnExit.className = "mmButton";

        // Note: Creates/reuses an element with id #sceneFadeOverlay
        let overlay: HTMLDivElement =
            document.querySelector("#sceneFadeOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            document.body.appendChild(overlay);
            overlay.id = "sceneFadeOverlay";
        }

        // Note: Creates/reuses an element with id #sceneStyle
        let link: HTMLLinkElement = document.querySelector("#sceneStyle");
        if (!link) {
            link = document.createElement("link");
            document.head.appendChild(link);
            link.id = "sceneStyle";
        }

        // Apply Scene stylesheet
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "./src/scene/title.css";

        // New Game Button click: Fade out then start game
        TitleScene.btnNewGame.onclick = () => {
            // Do nothing if currently fading
            if (TitleScene.isFading) return;
            TitleScene.isFading = true;

            // Disable clicking other elements and fade out screen
            overlay.style.pointerEvents = "auto";
            overlay.style.opacity = "1";

            // Switch Scene after fade out
            setTimeout(() => {
                TitleScene.deactivate();
                GameScene.activate();
                TitleScene.isFading = false;
            }, 1000);
        };
    },

    ////////////////////////////////////////////////////////////////////////////

    deactivate() {
        // Do nothing if already inactive
        if (!TitleScene.isActive) return;
        TitleScene.isActive = false;

        // Destroy this Scene's DOM Elements
        TitleScene.title.remove();
        TitleScene.menuArt.remove();
        TitleScene.menuBG.remove();
        TitleScene.btnContinue.remove();
        TitleScene.btnNewGame.remove();
        TitleScene.btnLoad.remove();
        TitleScene.btnOptions.remove();
        TitleScene.btnExit.remove();

        // Delete handles to trigger garbage collection
        delete TitleScene.title;
        delete TitleScene.menuArt;
        delete TitleScene.menuBG;
        delete TitleScene.btnContinue;
        delete TitleScene.btnNewGame;
        delete TitleScene.btnLoad;
        delete TitleScene.btnOptions;
        delete TitleScene.btnExit;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default TitleScene;
