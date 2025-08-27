import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import type {
  ComponentInfo,
  ComponentDetail,
  ComponentCategory,
  DiscoveryOptions,
} from '../types/index.js'

// Load the static components data
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const componentsDataPath = join(__dirname, '../data/components.json')
const componentsData = JSON.parse(readFileSync(componentsDataPath, 'utf-8'))

// Transform the JSON data to match our ComponentInfo type
const transformComponentData = (component: any): ComponentInfo => {
  return {
    name: component.name,
    displayName: component.name,
    category: component.category as ComponentCategory,
    description: component.description,
    exportPath: 'smarthr-ui',
    hasStorybook: component.hasStorybook || false,
    deprecated: component.deprecated || false,
  }
}

export async function discoverComponents(options: DiscoveryOptions = {}): Promise<ComponentInfo[]> {
  const { includeExperimental = false, includeDeprecated = false, categories } = options

  // Transform all components from the static data
  let components = componentsData.map(transformComponentData)

  // Apply filters
  components = components.filter((component: ComponentInfo) => {
    // Filter experimental components if not requested
    if (!includeExperimental && component.category === 'Experimental') {
      return false
    }

    // Filter deprecated components if not requested
    if (!includeDeprecated && component.deprecated) {
      return false
    }

    // Filter by category if specified
    if (categories && !categories.includes(component.category)) {
      return false
    }

    return true
  })

  // Components are already sorted in the static data
  return components
}

export async function getComponentDetails(componentName: string): Promise<ComponentDetail | null> {
  const components = await discoverComponents({
    includeDeprecated: true,
    includeExperimental: true,
  })
  const component = components.find((c) => c.name === componentName)

  if (!component) {
    return null
  }

  return {
    ...component,
    props: [], // TODO: Implement prop extraction in static data generation
    examples: [], // TODO: Extract from stories in static data generation
    dependencies: [], // TODO: Analyze imports in static data generation
  }
}
