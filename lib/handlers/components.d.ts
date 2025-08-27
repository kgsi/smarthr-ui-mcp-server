import type { ComponentInfo, ComponentDetail, DiscoveryOptions } from '../types/index.js';
export declare class ComponentHandlers {
    listComponents(options?: DiscoveryOptions): Promise<ComponentInfo[]>;
    getComponent(name: string): Promise<ComponentDetail | null>;
    searchComponents(query: string): Promise<ComponentInfo[]>;
    getComponentsByCategory(category: string): Promise<ComponentInfo[]>;
    generateComponentCode(componentName: string, props: Record<string, any>): Promise<string>;
}
//# sourceMappingURL=components.d.ts.map