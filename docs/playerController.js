"use strict";
class PlayerController {
    static x;
    static y;
    static playerElement;
    static playerSize = 40;
    static speed = 200;
    static SpawnPlayer(x, y) {
        this.x = x - this.playerSize;
        this.y = y - this.playerSize;
        this.playerElement = Assets.player(this.x, this.y, this.playerSize).root;
        GameManager.layerMain.appendChild(this.playerElement);
    }
    static #movement(deltaTime) {
        if (Actions.buttonsPressed.has(PlayerAction.Up)) {
            this.y += -this.speed * deltaTime;
            this.playerElement.setAttribute("y", this.y.toString());
        }
        if (Actions.buttonsPressed.has(PlayerAction.Down)) {
            this.y += this.speed * deltaTime;
            this.playerElement.setAttribute("y", this.y.toString());
        }
        if (Actions.buttonsPressed.has(PlayerAction.Left)) {
            this.x += -this.speed * deltaTime;
            this.playerElement.setAttribute("x", this.x.toString());
        }
        if (Actions.buttonsPressed.has(PlayerAction.Right)) {
            this.x += this.speed * deltaTime;
            this.playerElement.setAttribute("x", this.x.toString());
        }
    }
    static update(deltaTime) {
        if (this.playerElement)
            this.#movement(deltaTime);
        if (Actions.buttonsPressed.has(PlayerAction.OpenMenu)) {
            Actions.buttonsPressed.delete(PlayerAction.OpenMenu);
            if (Actions.gameState.has(GameState.MenuOpen)) {
                Actions.gameState.delete(GameState.MenuOpen);
                GameManager.instructions.elementsWithId.locker.textContent = "Press Q to unlock object spawning: locked";
                GameManager.instructions.elementsWithId.lmouse1.style.fill = "gray";
                GameManager.instructions.elementsWithId.lmouse2.style.fill = "gray";
            }
            else {
                Actions.gameState.add(GameState.MenuOpen);
                GameManager.instructions.elementsWithId.locker.textContent = "Press Q to lock object spawning: unlocked";
                GameManager.instructions.elementsWithId.lmouse1.style.fill = "";
                GameManager.instructions.elementsWithId.lmouse2.style.fill = "";
            }
            console.log("Menu is open:", Actions.gameState.has(GameState.MenuOpen));
        }
        if (Actions.buttonsPressed.has(PlayerAction.Primary) && Actions.gameState.has(GameState.MenuOpen)) {
            GameManager.spawnVerletBall(Camera.worldMouseX, Camera.worldMouseY, 10, "#555555");
        }
        if (Actions.buttonsPressed.has(PlayerAction.Secondary) && Actions.gameState.has(GameState.MenuOpen)) {
            Actions.buttonsPressed.delete(PlayerAction.Secondary);
            GameManager.spawnVerletBall(Camera.worldMouseX, Camera.worldMouseY, 10, "#000000");
        }
    }
}
