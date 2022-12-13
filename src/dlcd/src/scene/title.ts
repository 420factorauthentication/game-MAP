/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const TitleScene: {
    /** SVG title text. */
    title?: HTMLElement;

    /** SVG art. */
    art?: HTMLElement;

    /** Animated space background. */
    bg?: HTMLElement;

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

        // Title create
        TitleScene.title = <HTMLElement>document.createElement("div");
        document.body.appendChild(TitleScene.title);

        // Title top-middle with margins
        TitleScene.title.style.position = "absolute";
        TitleScene.title.style.left = "5vw";
        TitleScene.title.style.top = "5vh";
        TitleScene.title.style.width = "90vw";
        TitleScene.title.style.height = "calc(90vh * 280 / 900)";
        TitleScene.title.style.zIndex = "2";

        // Title svg
        TitleScene.title.style.backgroundImage =
            "url(./assets/art/mm-title.svg)";
        TitleScene.title.style.backgroundSize = "100% 100%";
        TitleScene.title.style.backgroundRepeat = "no-repeat";

        // Art create
        TitleScene.art = <HTMLElement>document.createElement("div");
        document.body.appendChild(TitleScene.art);

        // Art bottom-left
        TitleScene.art.style.position = "absolute";
        TitleScene.art.style.left = "0";
        TitleScene.art.style.bottom = "0";
        TitleScene.art.style.width = "calc(100vw * 780 / 1440)";
        TitleScene.art.style.height = "calc(100vh * 620 / 900)";
        TitleScene.art.style.zIndex = "2";

        // Art svg
        TitleScene.art.style.backgroundImage = "url(./assets/art/mm-art0.svg)";
        TitleScene.art.style.backgroundSize = "100% 100%";
        TitleScene.art.style.backgroundRepeat = "no-repeat";

        // Art margins and blurred edges
        TitleScene.art.style.boxShadow =
            "inset 3vw 4vh 16px #515151, inset 0 -4vh 16px #515151";

        // BG create
        TitleScene.bg = <HTMLElement>document.createElement("div");
        document.body.appendChild(TitleScene.bg);

        // BG centered
        TitleScene.bg.style.position = "absolute";
        TitleScene.bg.style.left = "0";
        TitleScene.bg.style.top = "0";
        TitleScene.bg.style.width = "100vw";
        TitleScene.bg.style.height = "100vh";
        TitleScene.bg.style.zIndex = "1";

        // BG style
        TitleScene.bg.style.backgroundColor = "#515151";
    },

    /** Destroy this Scene's DOM Elements and cleanup all garbage. */
    deactivate() {
        if (!TitleScene.isActive) return;
        TitleScene.isActive = false;

        TitleScene.title.remove();
        delete TitleScene.title;

        TitleScene.bg.remove();
        delete TitleScene.bg;
    },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default TitleScene;
