/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const TitleScene: {
    /** SVG title text. */
    title?: HTMLElement;

    /** SVG art. */
    menuArt?: HTMLElement;

    /** Currently solid color bg. TODO: Animated space bg */
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

    /** Is this Scene currently displaying it's DOM Elements? */
    isActive?: boolean;

    /** Creates this Scene's DOM Elements. */
    activate(): void;

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate(): void;
} = {
    /** Creates this Scene's DOM Elements. */
    activate() {
        // Do nothing if active
        if (TitleScene.isActive) return;
        TitleScene.isActive = true;

        ///////////
        // TITLE //
        ///////////
        TitleScene.title = <HTMLElement>document.createElement("div");
        document.body.appendChild(TitleScene.title);

        // Size
        TitleScene.title.style.width = "90vw";
        TitleScene.title.style.height = "calc(90vh * 280 / 900)";

        // Position - top-middle with margins
        TitleScene.title.style.position = "absolute";
        TitleScene.title.style.left = "5vw";
        TitleScene.title.style.top = "5vh";
        TitleScene.title.style.zIndex = "3";

        // Style - css art
        TitleScene.title.style.backgroundImage =
            "url(./assets/art/mm-title.svg)";
        TitleScene.title.style.backgroundSize = "100% 100%";
        TitleScene.title.style.backgroundRepeat = "no-repeat";

        //////////////
        // MENU ART //
        //////////////
        TitleScene.menuArt = <HTMLElement>document.createElement("div");
        document.body.appendChild(TitleScene.menuArt);

        // Size
        TitleScene.menuArt.style.width = "calc(100vw * 780 / 1440)";
        TitleScene.menuArt.style.height = "calc(100vh * 620 / 900)";

        // Position - bottom-left with margins and blurred edges
        TitleScene.menuArt.style.position = "absolute";
        TitleScene.menuArt.style.left = "0";
        TitleScene.menuArt.style.bottom = "0";
        TitleScene.menuArt.style.zIndex = "2";
        TitleScene.menuArt.style.boxShadow =
            "inset 3vw 4vh 16px black, inset 0 -4vh 16px black";

        // Style - css art
        TitleScene.menuArt.style.backgroundImage =
            "url(./assets/art/mm-art0.svg)";
        TitleScene.menuArt.style.backgroundSize = "100% 100%";
        TitleScene.menuArt.style.backgroundRepeat = "no-repeat";

        /////////////
        // MENU BG //
        /////////////
        TitleScene.menuBG = <HTMLElement>document.createElement("div");
        document.body.appendChild(TitleScene.menuBG);

        // Size
        TitleScene.menuBG.style.width = "100vw";
        TitleScene.menuBG.style.height = "100vh";

        // Position - centered
        TitleScene.menuBG.style.position = "absolute";
        TitleScene.menuBG.style.left = "0";
        TitleScene.menuBG.style.top = "0";
        TitleScene.menuBG.style.zIndex = "1";

        // Style - css solid color
        TitleScene.menuBG.style.backgroundColor = "black";

        /////////////////////
        // CONTINUE BUTTON //
        /////////////////////
        TitleScene.btnContinue = <HTMLElement>document.createElement("a");
        document.body.appendChild(TitleScene.btnContinue);

        // Position
        TitleScene.btnContinue.style.position = "absolute";
        TitleScene.btnContinue.style.left = "calc(100vw * 808 / 1440)";
        TitleScene.btnContinue.style.top = "calc(100vh * 308 / 900)";

        // Style - css art
        TitleScene.btnContinue.style.backgroundImage =
            "url(./assets/art/mm-btn-continue.svg)";

        /////////////////////
        // NEW GAME BUTTON //
        /////////////////////
        TitleScene.btnNewGame = <HTMLElement>document.createElement("a");
        document.body.appendChild(TitleScene.btnNewGame);

        // Position
        TitleScene.btnNewGame.style.position = "absolute";
        TitleScene.btnNewGame.style.left = "calc(100vw * 898 / 1440)";
        TitleScene.btnNewGame.style.top = "calc(100vh * 426 / 900)";

        // Style - css art
        TitleScene.btnNewGame.style.backgroundImage =
            "url(./assets/art/mm-btn-newgame.svg)";

        //////////////////////
        // LOAD GAME BUTTON //
        //////////////////////
        TitleScene.btnLoad = <HTMLElement>document.createElement("a");
        document.body.appendChild(TitleScene.btnLoad);

        // Position
        TitleScene.btnLoad.style.position = "absolute";
        TitleScene.btnLoad.style.left = "calc(100vw * 988 / 1440)";
        TitleScene.btnLoad.style.top = "calc(100vh * 544 / 900)";

        // Style - css art
        TitleScene.btnLoad.style.backgroundImage =
            "url(./assets/art/mm-btn-load.svg)";

        ////////////////////
        // OPTIONS BUTTON //
        ////////////////////
        TitleScene.btnOptions = <HTMLElement>document.createElement("a");
        document.body.appendChild(TitleScene.btnOptions);

        // Position
        TitleScene.btnOptions.style.position = "absolute";
        TitleScene.btnOptions.style.left = "calc(100vw * 1078 / 1440)";
        TitleScene.btnOptions.style.top = "calc(100vh * 661 / 900)";

        // Style - css art
        TitleScene.btnOptions.style.backgroundImage =
            "url(./assets/art/mm-btn-options.svg)";

        ////////////////////////////
        // EXIT TO DESKTOP BUTTON //
        ////////////////////////////
        TitleScene.btnExit = <HTMLElement>document.createElement("a");
        document.body.appendChild(TitleScene.btnExit);

        // Position
        TitleScene.btnExit.style.position = "absolute";
        TitleScene.btnExit.style.left = "calc(100vw * 1168 / 1440)";
        TitleScene.btnExit.style.top = "calc(100vh * 780 / 900)";

        // Style - css art
        TitleScene.btnExit.style.backgroundImage =
            "url(./assets/art/mm-btn-exit.svg)";

        /////////////////
        // ALL BUTTONS //
        /////////////////
        let buttons: HTMLElement[] = [
            TitleScene.btnContinue,
            TitleScene.btnNewGame,
            TitleScene.btnLoad,
            TitleScene.btnOptions,
            TitleScene.btnExit,
        ];
        for (const button of buttons) {
            // Size
            button.style.width = "calc(100vw * 244 / 1440)";
            button.style.height = "calc(100vh * 92 / 900)";
            // Position
            button.style.zIndex = "4";
            // Style - css art
            button.style.backgroundSize = "100% 100%";
            button.style.backgroundRepeat = "no-repeat";
        }
    },

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate() {
        if (!TitleScene.isActive) return;
        TitleScene.isActive = false;

        TitleScene.title.remove();
        delete TitleScene.title;

        TitleScene.menuArt.remove();
        delete TitleScene.menuArt;

        TitleScene.menuBG.remove();
        delete TitleScene.menuBG;

        TitleScene.btnContinue.remove();
        delete TitleScene.btnContinue;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default TitleScene;
