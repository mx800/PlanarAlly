import io from "socket.io-client";

import { Asset } from "@/core/comm/types";
import { assetStore } from "./store";

export const socket = io(location.protocol + "//" + location.host + "/pa_assetmgmt", { autoConnect: false });

// export const socket = io.connect(location.protocol + "//" + location.host + "/pa_assetmgmt");
socket.on("connect", () => {
    console.log("Connected");
});
socket.on("disconnect", () => {
    console.log("Disconnected");
});
socket.on("redirect", (destination: string) => {
    console.log("redirecting");
    window.location.href = destination;
});
socket.on("Folder.Root.Set", (root: number) => {
    assetStore.setRoot(root);
});
socket.on("Folder.Set", (folder: Asset) => {
    assetStore.clear();
    if (folder.children) {
        for (const child of folder.children) {
            assetStore.idMap.set(child.id, child);
            if (child.file_hash) {
                assetStore.files.push(child.id);
            } else {
                assetStore.folders.push(child.id);
            }
        }
    }
});
socket.on("Folder.Create", (folder: Asset) => {
    assetStore.folders.push(folder.id);
    assetStore.idMap.set(folder.id, folder);
});
socket.on("Asset.Upload.Finish", (asset: Asset) => {
    assetStore.idMap.set(asset.id, asset);
    assetStore.files.push(asset.id);
});
