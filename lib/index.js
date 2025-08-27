#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema, ListToolsRequestSchema, CallToolRequestSchema, ErrorCode, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { ComponentHandlers } from './handlers/components.js';
const server = new Server({
    name: '@smarthr-ui/mcp-server',
    version: '0.1.0',
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
const handlers = new ComponentHandlers();
// Resource: List all components
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'smarthr-ui://components',
                name: 'SmartHR UI Components',
                description: 'List of all available SmartHR UI components',
                mimeType: 'application/json',
            },
        ],
    };
});
// Resource: Read component list or specific component
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    if (uri === 'smarthr-ui://components') {
        const components = await handlers.listComponents();
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(components, null, 2),
                },
            ],
        };
    }
    // Handle specific component URIs like smarthr-ui://components/Button
    const componentMatch = uri.match(/^smarthr-ui:\/\/components\/(.+)$/);
    if (componentMatch) {
        const componentName = componentMatch[1];
        const component = await handlers.getComponent(componentName);
        if (!component) {
            throw new McpError(ErrorCode.InvalidRequest, `Component ${componentName} not found`);
        }
        return {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(component, null, 2),
                },
            ],
        };
    }
    throw new McpError(ErrorCode.InvalidRequest, `Unknown resource URI: ${uri}`);
});
// Tool: Search components
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'search_components',
                description: 'Search SmartHR UI components by name, category, or description',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'get_component',
                description: 'Get detailed information about a specific SmartHR UI component',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Component name',
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'list_components_by_category',
                description: 'List all components in a specific category',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            description: 'Component category',
                            enum: [
                                'Button',
                                'Form',
                                'Layout',
                                'Navigation',
                                'Display',
                                'Feedback',
                                'Dialog',
                                'Table',
                                'Input',
                                'Interactive',
                                'Experimental',
                                'Other',
                            ],
                        },
                    },
                    required: ['category'],
                },
            },
            {
                name: 'generate_component_code',
                description: 'Generate usage code for a SmartHR UI component with specified props',
                inputSchema: {
                    type: 'object',
                    properties: {
                        component: {
                            type: 'string',
                            description: 'Component name',
                        },
                        props: {
                            type: 'object',
                            description: 'Component props as key-value pairs',
                        },
                    },
                    required: ['component'],
                },
            },
        ],
    };
});
// Tool: Execute tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'search_components': {
            const { query } = args;
            const results = await handlers.searchComponents(query);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        }
        case 'get_component': {
            const { name: componentName } = args;
            const component = await handlers.getComponent(componentName);
            if (!component) {
                throw new McpError(ErrorCode.InvalidRequest, `Component ${componentName} not found`);
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(component, null, 2),
                    },
                ],
            };
        }
        case 'list_components_by_category': {
            const { category } = args;
            const components = await handlers.getComponentsByCategory(category);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(components, null, 2),
                    },
                ],
            };
        }
        case 'generate_component_code': {
            const { component, props = {} } = args;
            try {
                const code = await handlers.generateComponentCode(component, props);
                return {
                    content: [
                        {
                            type: 'text',
                            text: code,
                        },
                    ],
                };
            }
            catch (error) {
                throw new McpError(ErrorCode.InvalidRequest, error instanceof Error ? error.message : 'Failed to generate component code');
            }
        }
        default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('SmartHR UI MCP server running...');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map