"use strict";
class CollisionGrid {
    grid = [];
    cellSize;
    gridWidth = 0;
    gridHeight = 0;
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.updateGridDimensions();
    }
    updateGridDimensions() {
        this.gridWidth = Math.ceil(Camera.viewbox.width / this.cellSize);
        this.gridHeight = Math.ceil(Camera.viewbox.height / this.cellSize);
        this.grid = Array(this.gridWidth).fill(null).map(() => Array(this.gridHeight).fill(null).map(() => []));
    }
    isInBounds(x, y) {
        return x >= Camera.viewbox.x && x < Camera.viewbox.x + Camera.viewbox.width &&
            y >= Camera.viewbox.y && y < Camera.viewbox.y + Camera.viewbox.height;
    }
    worldToGrid(x, y) {
        const gridX = Math.floor((x - Camera.viewbox.x) / this.cellSize);
        const gridY = Math.floor((y - Camera.viewbox.y) / this.cellSize);
        return [gridX, gridY];
    }
    clear() {
        this.updateGridDimensions();
    }
    insert(unit) {
        if (!this.isInBounds(unit.x, unit.y)) {
            unit.paused = true;
            return;
        }
        unit.paused = false;
        const [gridX, gridY] = this.worldToGrid(unit.x, unit.y);
        if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
            this.grid[gridX][gridY].push(unit);
        }
    }
    findNeighbors(unit) {
        if (unit.paused)
            return [];
        const neighbors = [];
        const [centerX, centerY] = this.worldToGrid(unit.x, unit.y);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const gridX = centerX + dx;
                const gridY = centerY + dy;
                if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
                    neighbors.push(...this.grid[gridX][gridY]);
                }
            }
        }
        return neighbors.filter(neighbor => neighbor !== unit);
    }
}
