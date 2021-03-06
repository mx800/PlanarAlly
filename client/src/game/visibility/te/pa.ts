import { layerManager } from "@/game/layers/manager";
import { gameStore } from "@/game/store";

import { CDT } from "./cdt";

export let PA_CDT = {
    vision: new CDT(),
    movement: new CDT(),
};

export function triangulate(target: "vision" | "movement", partial: boolean = false) {
    const cdt = new CDT();

    let shapes;
    if (target === "vision") shapes = gameStore.visionBlockers;
    else shapes = gameStore.movementblockers;

    for (const sh of shapes) {
        const shape = layerManager.UUIDMap.get(sh)!;
        if (partial && !shape.visibleInCanvas(layerManager.getLayer()!.canvas)) continue;
        for (let i = 0; i < shape.points.length; i++) {
            cdt.insertConstraint(shape.points[i], shape.points[(i + 1) % shape.points.length]);
        }
    }
    // LEFT WALL
    cdt.insertConstraint([-1e10, -1e10], [-1e10, 1e10]);
    cdt.insertConstraint([-1e10, 1e10], [-1e11, 1e10]);
    cdt.insertConstraint([-1e11, 1e10], [-1e11, -1e10]);
    cdt.insertConstraint([-1e11, -1e10], [-1e10, -1e10]);
    // TOP WALL
    cdt.insertConstraint([-1e10, -1e10], [1e10, -1e10]);
    cdt.insertConstraint([1e10, -1e10], [1e10, -1e11]);
    cdt.insertConstraint([1e10, -1e11], [-1e10, -1e11]);
    cdt.insertConstraint([-1e10, -1e11], [-1e10, -1e10]);
    // RIGHT WALL
    cdt.insertConstraint([1e10, -1e10], [1e10, 1e10]);
    cdt.insertConstraint([1e10, 1e10], [1e11, 1e10]);
    cdt.insertConstraint([1e11, 1e10], [1e11, -1e10]);
    cdt.insertConstraint([1e11, -1e10], [1e10, -1e10]);
    // BOT WALL
    cdt.insertConstraint([-1e10, 1e10], [1e10, 1e10]);
    cdt.insertConstraint([1e10, 1e10], [1e10, 1e11]);
    cdt.insertConstraint([1e10, 1e11], [-1e10, 1e11]);
    cdt.insertConstraint([-1e10, 1e11], [-1e10, 1e10]);
    PA_CDT[target] = cdt;
    (<any>window).CDT = PA_CDT;
}
