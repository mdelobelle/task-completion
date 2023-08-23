import "obsidian";
//@ts-ignore
import { DataviewApi } from "obsidian-dataview";

declare module "obsidian" {
    interface Workspace {
        /** Sent to rendered dataview components to tell them to possibly refresh */
        on(name: "dataview:refresh-views", callback: () => void, ctx?: any): EventRef;
    }
    interface MetadataCache {
        on(name: "dataview:metadata-change", callback: () => void, ctx?: any): EventRef;
        on(name: "dataview:index-ready", callback: () => void, ctx?: any): EventRef;
    }
}