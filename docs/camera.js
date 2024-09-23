"use strict";
class Camera {
    static x = window.innerWidth / 2;
    static y = window.innerHeight / 2 + 50;
    static z = 1;
    static game;
    static mainView;
    static viewbox;
    static worldMouseX = 0;
    static worldMouseY = 0;
    static screenMouseX = 0;
    static screenMouseY = 0;
    static resize() {
        this.mainView.style.width = `${window.innerWidth}px`;
        this.mainView.style.height = `${window.innerHeight}px`;
        const newWidth = window.innerWidth / this.z;
        const newHeight = window.innerHeight / this.z;
        const deltaWidth = newWidth - this.viewbox.width;
        const deltaHeight = newHeight - this.viewbox.height;
        this.x += deltaWidth / 2;
        this.y += deltaHeight / 2;
        this.viewbox.x = -this.x;
        this.viewbox.y = -this.y;
        this.viewbox.width = newWidth;
        this.viewbox.height = newHeight;
    }
    static init() {
        const screenObj = html `
        <div id="game">
            <svg id=mainView viewBox="${-this.x} ${-this.y} ${window.innerWidth / this.z} ${window.innerHeight / this.z}" style="width: ${window.innerWidth}px; height: ${window.innerHeight}px;">
                <g id="layerGround">

                </g>
                <g id="layerMain">
                    
                </g>
                <g id="layerEffects">

                </g>
            </svg>
        </div>`;
        document.body.appendChild(screenObj.root);
        this.game = screenObj.root;
        this.mainView = screenObj.elementsWithId.mainView;
        GameManager.layerGround = screenObj.elementsWithId.layerGround;
        GameManager.layerMain = screenObj.elementsWithId.layerMain;
        GameManager.layerEffects = screenObj.elementsWithId.layerEffects;
        this.viewbox = this.mainView.viewBox.baseVal;
        window.addEventListener("mousemove", (e) => this.#handleMousePos(e));
    }
    static #handleMousePos(e) {
        this.screenMouseX = e.clientX;
        this.screenMouseY = e.clientY;
        this.worldMouseX = this.screenMouseX - this.x;
        this.worldMouseY = this.screenMouseY - this.y;
    }
    static update(deltaTime) {
        if (Actions.buttonsPressed.has(PlayerAction.CamUp)) {
            this.y += 300 * deltaTime;
            this.resize();
        }
        if (Actions.buttonsPressed.has(PlayerAction.CamDown)) {
            this.y += -300 * deltaTime;
            this.resize();
        }
        if (Actions.buttonsPressed.has(PlayerAction.CamLeft)) {
            this.x += 300 * deltaTime;
            this.resize();
        }
        if (Actions.buttonsPressed.has(PlayerAction.CamRight)) {
            this.x += -300 * deltaTime;
            this.resize();
        }
    }
}
