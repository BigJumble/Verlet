"use strict";
class GameManager {
    static layerGround;
    static layerMain;
    static layerEffects;
    static objects = [];
    static collisionGrid;
    static instructions;
    static load() {
        PlayerController.SpawnPlayer(0, -290);
        this.layerGround.appendChild(Assets.ball(-200, 0, 200, "#ffffff").root);
        this.layerGround.appendChild(Assets.ball(-380, -320, 200, "#ffffff").root);
        this.layerGround.appendChild(Assets.ball(-20, -320, 200, "#ffffff").root);
        this.instructions = Assets.instructions(0, -500);
        this.layerGround.appendChild(this.instructions.root);
        this.collisionGrid = new CollisionGrid(20);
    }
    static spawnVerletBall(x, y, radius, color) {
        const obj = {
            oldx: x,
            oldy: y,
            x,
            y,
            accx: 0,
            accy: 0,
            radius,
            element: Assets.ball(x - radius, y - radius, radius, color).root,
            paused: false,
        };
        this.layerMain.appendChild(obj.element);
        this.objects.push(obj);
    }
    static removeObject(obj, i) {
        obj.element.remove();
        this.objects.splice(i, 1);
    }
    static updatePhysics(deltaTime) {
        this.collisionGrid.clear();
        for (const obj of this.objects) {
            this.collisionGrid.insert(obj);
        }
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            if (obj.paused) {
                this.removeObject(obj, i);
                i--;
                continue;
            }
            ;
            this.addAcceleration(obj, 0, 1000);
            this.positionStep(obj, deltaTime);
            this.solveCollisions2(obj);
            this.obstacle(obj);
            this.circleHitbox(obj);
            this.updateGraphics(obj);
        }
    }
    static updateGraphics(obj) {
        obj.element.setAttribute("x", (obj.x - obj.radius).toString());
        obj.element.setAttribute("y", (obj.y - obj.radius).toString());
    }
    static obstacle(obj) {
        const maxDistance = PlayerController.playerSize + obj.radius;
        const dx = obj.x - PlayerController.x - PlayerController.playerSize;
        const dy = obj.y - PlayerController.y - PlayerController.playerSize;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < maxDistance * maxDistance) {
            obj.x += dx * 0.05;
            obj.y += dy * 0.05;
        }
    }
    static solveCollisions2(obj) {
        const neighbors = this.collisionGrid.findNeighbors(obj);
        for (const obj2 of neighbors) {
            const deltaX = obj.x - obj2.x;
            const deltaY = obj.y - obj2.y;
            const dist2 = deltaX * deltaX + deltaY * deltaY;
            const radius2 = (obj.radius + obj2.radius) * (obj.radius + obj2.radius);
            if (dist2 < radius2) {
                const dist = Math.sqrt(dist2);
                obj.x += deltaX * 0.5 / dist;
                obj.y += deltaY * 0.5 / dist;
                obj2.x -= deltaX * 0.5 / dist;
                obj2.y -= deltaY * 0.5 / dist;
            }
        }
    }
    static circleHitbox(obj) {
        const centers = [
            { x: 0, y: 200 },
            { x: 180, y: -120 },
            { x: -180, y: -120 }
        ];
        const radius = 200;
        const maxDistance = radius - obj.radius;
        let closestCenterIndex = 0;
        let minDistanceSquared = Infinity;
        centers.forEach((center, index) => {
            const dx = obj.x - center.x;
            const dy = obj.y - center.y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared < minDistanceSquared) {
                minDistanceSquared = distanceSquared;
                closestCenterIndex = index;
            }
        });
        if (minDistanceSquared > maxDistance * maxDistance) {
            const closestCenter = centers[closestCenterIndex];
            const dx = obj.x - closestCenter.x;
            const dy = obj.y - closestCenter.y;
            const distancePercent = Math.sqrt(minDistanceSquared) / maxDistance;
            obj.x = closestCenter.x + dx / distancePercent;
            obj.y = closestCenter.y + dy / distancePercent;
        }
    }
    static addAcceleration(obj, accX, accY) {
        obj.accx += accX;
        obj.accy += accY;
    }
    static positionStep(obj, deltaTime) {
        const velx = obj.x - obj.oldx;
        const vely = obj.y - obj.oldy;
        obj.oldx = obj.x;
        obj.oldy = obj.y;
        obj.x += velx + obj.accx * deltaTime * deltaTime;
        obj.y += vely + obj.accy * deltaTime * deltaTime;
        obj.accx = 0;
        obj.accy = 0;
    }
}
