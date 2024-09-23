enum PlayerAction {
    Up = "KeyW",
    Down = "KeyS",
    Left = "KeyA",
    Right = "KeyD",
    CamUp = "ArrowUp",
    CamDown = "ArrowDown",
    CamLeft = "ArrowLeft",
    CamRight = "ArrowRight",
    Jump = "Space",
    Run = "ShiftLeft",
    Primary = "Mouse0",
    Secondary = "Mouse2",
    Interact = "KeyE",
    OpenMenu = "KeyQ",
    D1 = "Digit1",
    D2 = "Digit2",
    D3 = "Digit3",
    D4 = "Digit4",
}

enum GameState {
    MenuOpen,
}



class Actions {

    static buttonsPressed = new Set<PlayerAction>();
    static gameState = new Set<GameState>();
    static invertedGA: Record<string, keyof typeof PlayerAction>;

    static init() {
        document.onkeydown = (e) => this.keyDown(e);
        document.onkeyup = (e) => this.keyUp(e);
        document.onmousedown = (e) => this.mouseDown(e);
        document.onmouseup = (e) => this.mouseUp(e);
        window.onresize = () => this.resize();
        window.oncontextmenu = (e) => {e.preventDefault();};
        this.invertGA();
    }
    static invertGA() {
        var ret: Record<string, keyof typeof PlayerAction> = {};
        for (const key in PlayerAction) {
            ret[PlayerAction[key as keyof typeof PlayerAction]] = key as keyof typeof PlayerAction; // kinssl - keep it not simple silly lol
        }
        this.invertedGA = ret;
    }
    static resize()
    {
        Camera.resize();
    }

    static keyDown(e: KeyboardEvent) {
        // e.preventDefault();
        const action = this.getActionFromKeyCode(e.code);
        if (action) {
            this.buttonsPressed.add(PlayerAction[action]);
        }
    }
    static keyUp(e: KeyboardEvent) {
        const action = this.getActionFromKeyCode(e.code);
        if (action) {
            this.buttonsPressed.delete(PlayerAction[action]);
        }
    }

    static mouseDown(e: MouseEvent) {
        e.preventDefault();
        const action = this.getActionFromKeyCode("Mouse" + e.button);
        if (action) {
            this.buttonsPressed.add(PlayerAction[action]);
        }
    }

    static mouseUp(e: MouseEvent) {
        const action = this.getActionFromKeyCode("Mouse" + e.button);
        if (action) {
            this.buttonsPressed.delete(PlayerAction[action]);
        }
    }



    static getActionFromKeyCode(code: string): keyof typeof PlayerAction {
        return this.invertedGA[code];
    }

    static changeKeyBinding(gs: PlayerAction, newKey: string) {
        (PlayerAction as any)[gs] = newKey; // idk why ppl like TS
        this.invertGA();
    }

}
