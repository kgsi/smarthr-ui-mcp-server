export interface ComponentInfo {
    name: string;
    displayName: string;
    category: ComponentCategory;
    description?: string;
    exportPath: string;
    hasStorybook: boolean;
    deprecated?: boolean;
}
export interface ComponentDetail extends ComponentInfo {
    props: PropDefinition[];
    examples?: CodeExample[];
    dependencies?: string[];
}
export interface PropDefinition {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: string;
    description?: string;
}
export interface CodeExample {
    title: string;
    code: string;
    language: 'tsx' | 'jsx';
}
export type ComponentCategory = 'Button' | 'Form' | 'Layout' | 'Navigation' | 'Display' | 'Feedback' | 'Dialog' | 'Table' | 'Input' | 'Interactive' | 'Experimental' | 'Other';
export interface DiscoveryOptions {
    includeExperimental?: boolean;
    includeDeprecated?: boolean;
    categories?: ComponentCategory[];
}
//# sourceMappingURL=index.d.ts.map