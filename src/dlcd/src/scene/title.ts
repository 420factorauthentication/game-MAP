/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const TitleScene: {
    /** Static main menu art. */
    art?: HTMLElement;

    /** Is this Scene currently displaying it's DOM Elements? */
    isActive?: boolean;

    /** Creates this Scene's DOM Elements. */
    activate(): void;

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate(): void;
} = {
    /** Creates this Scene's DOM Elements. */
    activate() {
        if (TitleScene.isActive) return;
        TitleScene.isActive = true;

        TitleScene.art = <HTMLElement>document.createElement("img");
        document.body.appendChild(TitleScene.art);
        TitleScene.art.style.position = "absolute";
        TitleScene.art.style.left = "5vw";
        TitleScene.art.style.top = "5vh";
        TitleScene.art.style.width = "90vw";
        TitleScene.art.style.height = "90vh";
        TitleScene.art.style.backgroundImage =
            "url(./assets/art/MainMenuArt.svg)";
        TitleScene.art.style.backgroundColor = "#515151";
        TitleScene.art.style.backgroundSize = "100% 100%";
        TitleScene.art.style.backgroundRepeat = "no-repeat";
    },

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate() {
        if (!TitleScene.isActive) return;
        TitleScene.isActive = false;

        TitleScene.art.remove();
        delete TitleScene.art;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default TitleScene;
