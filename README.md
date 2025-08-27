# SmartHR UI MCP Server

Model Context Protocol (MCP) server for SmartHR UI components, providing AI tools and Claude Code with direct access to SmartHR UI component information and code generation capabilities.

## Features

- **Component Discovery**: Automatically discover and list all SmartHR UI components
- **Component Search**: Search components by name, category, or description
- **Code Generation**: Generate usage code for components with specified props
- **Category Filtering**: Browse components by category (Button, Form, Layout, etc.)

## Installation

```bash
pnpm install
pnpm build
```

## Usage

### As MCP Server

Configure your MCP client to use this server:

```json
{
  "mcpServers": {
    "smarthr-ui-mcp": {
      "command": "node",
      "args": ["/Users/username/smarthr-ui-mcp/lib/index.js"],
      "cwd": "/Users/username/smarthr-ui-mcp"
    }
  }
}
```

Replace `/Users/username/smarthr-ui-mcp` with the actual path to the MCP server.

### Development

```bash
# Start development server
pnpm dev

# Build the server
pnpm build

# Run tests
pnpm test
```

## MCP Resources

- `smarthr-ui://components` - List of all SmartHR UI components
- `smarthr-ui://components/{name}` - Detailed information about a specific component

## MCP Tools

### `search_components`

Search components by name, category, or description.

### `get_component`

Get detailed information about a specific component.

### `list_components_by_category`

List all components in a specific category.

### `generate_component_code`

Generate usage code for a component with specified props.

## Component Categories

- **Button**: Button components and related actions
- **Form**: Form controls and validation
- **Layout**: Layout and spacing components
- **Navigation**: Navigation and routing components
- **Display**: Text, badges, and content display
- **Feedback**: Notifications, tooltips, and user feedback
- **Dialog**: Modals and dialog components
- **Table**: Data table components
- **Input**: Input fields and form elements
- **Experimental**: Beta and experimental components

## Architecture

```
src/
├── index.ts              # MCP server entry point
├── handlers/
│   └── components.ts     # Component-related handlers
├── types/
│   └── index.ts         # TypeScript type definitions
└── utils/
    └── componentDiscovery.ts  # Component discovery logic
```

## License

MIT
