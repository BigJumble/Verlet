class Animator{
    static isUpdating = false;
    static lastTimestamp = 0;
    static deltaTime = 0;
    static moveSpeed = 20;
    static FPSCounter = 0;
    static {

    }
    static logFPS()
    {
        // in console type: Animator.logFPS();
        setInterval(() => {
            console.log("FPS:", this.FPSCounter);
            this.FPSCounter = 0;
        }, 1000);
    }
    static update() {
        if (this.isUpdating) return;

        this.isUpdating = true;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((timestamp)=>this.#smoothUpdate(timestamp));
    }
    static #smoothUpdate(timestamp: number) {
        Animator.deltaTime = (timestamp - Animator.lastTimestamp) / 1000;
        Animator.lastTimestamp = timestamp;
        Animator.FPSCounter++;
        PlayerController.update(Animator.deltaTime);
        GameManager.updatePhysics(1/240);
        Camera.update(Animator.deltaTime);

        requestAnimationFrame(Animator.#smoothUpdate);
    }
}