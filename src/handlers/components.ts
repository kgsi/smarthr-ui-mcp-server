import { discoverComponents, getComponentDetails } from '../utils/componentDiscovery.js'
import type { ComponentInfo, ComponentDetail, DiscoveryOptions } from '../types/index.js'

export class ComponentHandlers {
  async listComponents(options?: DiscoveryOptions): Promise<ComponentInfo[]> {
    return await discoverComponents(options)
  }

  async getComponent(name: string): Promise<ComponentDetail | null> {
    return await getComponentDetails(name)
  }

  async searchComponents(query: string): Promise<ComponentInfo[]> {
    const allComponents = await discoverComponents({
      includeExperimental: true,
      includeDeprecated: false,
    })

    const lowerQuery = query.toLowerCase()
    return allComponents.filter(
      (component) =>
        component.name.toLowerCase().includes(lowerQuery) ||
        component.category.toLowerCase().includes(lowerQuery) ||
        (component.description?.toLowerCase().includes(lowerQuery) ?? false),
    )
  }

  async getComponentsByCategory(category: string): Promise<ComponentInfo[]> {
    const allComponents = await discoverComponents()
    return allComponents.filter((c) => c.category.toLowerCase() === category.toLowerCase())
  }

  async generateComponentCode(componentName: string, props: Record<string, any>): Promise<string> {
    const component = await getComponentDetails(componentName)
    if (!component) {
      throw new Error(`Component ${componentName} not found`)
    }

    // Generate basic component usage code
    const propsString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`
        } else if (typeof value === 'boolean') {
          return value ? key : `${key}={false}`
        } else {
          return `${key}={${JSON.stringify(value)}}`
        }
      })
      .join(' ')

    return `import { ${componentName} } from 'smarthr-ui'

// Usage example
<${componentName}${propsString ? ' ' + propsString : ''} />`
  }
}
