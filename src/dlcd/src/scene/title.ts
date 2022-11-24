/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const TitleScene: {
    titleText?: HTMLElement;

    /** Creates this Scene's DOM Elements. */
    activate(): void;
} = {
    /** Creates this Scene's DOM Elements. */
    activate() {
        TitleScene.titleText = <HTMLElement>document.createElement("h1");
        document.body.appendChild(TitleScene.titleText);
    },
};
