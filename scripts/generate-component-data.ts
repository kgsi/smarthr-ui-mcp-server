#!/usr/bin/env tsx

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, basename, dirname } from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Path to SmartHR UI components (relative to this script)
const COMPONENTS_PATH = join(__dirname, '../../smarthr-ui/src/components')
const OUTPUT_PATH = join(__dirname, '../src/data/components.json')

interface ComponentInfo {
  name: string
  category: string
  description?: string
  hasStorybook: boolean
  deprecated?: boolean
}

const CATEGORY_MAPPING: Record<string, string> = {
  // Button Category
  'Button': 'Button',
  'DropdownMenuButton': 'Button',
  'UnstyledButton': 'Button',
  'AnchorButton': 'Button',
  
  // Input Category
  'Input': 'Input',
  'InputFile': 'Input',
  'InputWithTooltip': 'Input',
  'SearchInput': 'Input',
  'CurrencyInput': 'Input',
  'Select': 'Input',
  'Textarea': 'Input',
  'Checkbox': 'Input',
  'RadioButton': 'Input',
  'RadioButtonPanel': 'Input',
  'Combobox': 'Input',
  'MultiCombobox': 'Input',
  'SingleCombobox': 'Input',
  'Switch': 'Input',
  'DatePicker': 'Input',
  'WarekiPicker': 'Input',
  'Calendar': 'Input',
  'Picker': 'Input',
  
  // Form Category
  'Form': 'Form',
  'FormControl': 'Form',
  'FormGroup': 'Form',
  'Fieldset': 'Form',
  'StepFormDialog': 'Form',
  'RequiredLabel': 'Form',
  
  // Table Category
  'Table': 'Table',
  'TableReel': 'Table',
  'SpreadsheetTable': 'Table',
  
  // Dialog Category
  'Dialog': 'Dialog',
  'ActionDialog': 'Dialog',
  'FormDialog': 'Dialog',
  'MessageDialog': 'Dialog',
  'ModelessDialog': 'Dialog',
  'RemoteDialogTrigger': 'Dialog',
  
  // Layout Category
  'Layout': 'Layout',
  'Base': 'Layout',
  'BaseColumn': 'Layout',
  'Center': 'Layout',
  'Cluster': 'Layout',
  'Stack': 'Layout',
  'Sidebar': 'Layout',
  'Container': 'Layout',
  'Header': 'Layout',
  'AppHeader': 'Layout',
  'BottomFixedArea': 'Layout',
  'FloatArea': 'Layout',
  'SectioningContent': 'Layout',
  'Reel': 'Layout',
  
  // Navigation Category
  'AppNavi': 'Navigation',
  'SideNav': 'Navigation',
  'SideMenu': 'Navigation',
  'TabBar': 'Navigation',
  'Pagination': 'Navigation',
  'Breadcrumb': 'Navigation',
  'PageCounter': 'Navigation',
  'Stepper': 'Navigation',
  'SegmentedControl': 'Navigation',
  'AppLauncher': 'Navigation',
  'LanguageSwitcher': 'Navigation',
  'UpwardLink': 'Navigation',
  
  // Feedback Category
  'Tooltip': 'Feedback',
  'Balloon': 'Feedback',
  'Flash': 'Feedback',
  'InformationPanel': 'Feedback',
  'NotificationBar': 'Feedback',
  'ResponseMessage': 'Feedback',
  'HelpLink': 'Feedback',
  'ErrorScreen': 'Feedback',
  
  // Display Category
  'Loader': 'Display',
  'Badge': 'Display',
  'StatusLabel': 'Display',
  'Text': 'Display',
  'TextLink': 'Display',
  'Heading': 'Display',
  'Chip': 'Display',
  'Icon': 'Display',
  'SmartHRLogo': 'Display',
  'SmartHRAILogo': 'Display',
  'Timeline': 'Display',
  'DefinitionList': 'Display',
  'LineClamp': 'Display',
  'VisuallyHiddenText': 'Display',
  'RangeSeparator': 'Display',
  
  // Interactive Category
  'Disclosure': 'Interactive',
  'AccordionPanel': 'Interactive',
  'Dropdown': 'Interactive',
  'FilterDropdown': 'Interactive',
  'SortDropdown': 'Interactive',
  'DropZone': 'Interactive',
  'FileViewer': 'Interactive',
  'Browser': 'Interactive',
  
  // Experimental Category
  'Experimental': 'Experimental',
}

function categorizeComponent(componentName: string): string {
  if (CATEGORY_MAPPING[componentName]) {
    return CATEGORY_MAPPING[componentName]
  }
  
  // Check if component name starts with any category key
  for (const [key, category] of Object.entries(CATEGORY_MAPPING)) {
    if (componentName.startsWith(key)) {
      return category
    }
  }
  
  const lowerName = componentName.toLowerCase()
  
  if (componentName.includes('Experimental') || lowerName.includes('experimental')) {
    return 'Experimental'
  }
  
  if (lowerName.includes('button') || lowerName.endsWith('btn')) {
    return 'Button'
  }
  
  if (lowerName.includes('input') || lowerName.includes('field') || 
      lowerName.includes('picker') || lowerName.includes('select') ||
      lowerName.includes('combobox') || lowerName.includes('switch') ||
      lowerName.includes('checkbox') || lowerName.includes('radio')) {
    return 'Input'
  }
  
  if (lowerName.includes('dialog') || lowerName.includes('modal') || lowerName.includes('popup')) {
    return 'Dialog'
  }
  
  if (lowerName.includes('table') || lowerName.includes('grid') || lowerName.includes('spreadsheet')) {
    return 'Table'
  }
  
  if (lowerName.includes('nav') || lowerName.includes('menu') || lowerName.includes('breadcrumb') ||
      lowerName.includes('pagination') || lowerName.includes('stepper') || lowerName.includes('tab')) {
    return 'Navigation'
  }
  
  if (lowerName.includes('tooltip') || lowerName.includes('balloon') || lowerName.includes('notification') ||
      lowerName.includes('alert') || lowerName.includes('flash') || lowerName.includes('message')) {
    return 'Feedback'
  }
  
  if (lowerName.includes('dropdown') || lowerName.includes('disclosure') || lowerName.includes('accordion') ||
      lowerName.includes('collapse') || lowerName.includes('viewer') || lowerName.includes('dropzone')) {
    return 'Interactive'
  }
  
  if (lowerName.includes('layout') || lowerName.includes('container') || lowerName.includes('wrapper') ||
      lowerName.includes('header') || lowerName.includes('footer') || lowerName.includes('area') ||
      lowerName.includes('section') || lowerName.includes('stack') || lowerName.includes('cluster')) {
    return 'Layout'
  }
  
  if (lowerName.includes('text') || lowerName.includes('heading') || lowerName.includes('label') ||
      lowerName.includes('badge') || lowerName.includes('chip') || lowerName.includes('icon') ||
      lowerName.includes('logo') || lowerName.includes('loader') || lowerName.includes('spinner')) {
    return 'Display'
  }
  
  return 'Other'
}

async function isComponentDirectory(dirPath: string): Promise<boolean> {
  try {
    const files = await readdir(dirPath)
    const dirName = basename(dirPath)
    
    const skipDirs = ['models', 'multilingualization', 'stories', 'types', 'utils', 'helpers']
    if (skipDirs.includes(dirName)) {
      return false
    }
    
    return files.some(file => 
      file === 'index.ts' || 
      file === 'index.tsx' ||
      file === `${dirName}.tsx` ||
      file === `${dirName}.ts`
    )
  } catch {
    return false
  }
}

async function getComponentDescription(componentPath: string): Promise<string | undefined> {
  try {
    const dirName = basename(componentPath)
    const possibleFiles = [
      join(componentPath, `${dirName}.tsx`),
      join(componentPath, 'index.tsx'),
      join(componentPath, `${dirName}.ts`),
      join(componentPath, 'index.ts'),
    ]
    
    for (const file of possibleFiles) {
      try {
        const content = await readFile(file, 'utf-8')
        const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//)
        if (jsdocMatch) {
          const comment = jsdocMatch[0]
          const descMatch = comment.match(/\*\s+(.+?)(?:\n|\*\/)/s)
          if (descMatch) {
            return descMatch[1].trim().replace(/\*/g, '').trim()
          }
        }
      } catch {
        // File doesn't exist, continue
      }
    }
  } catch {
    // Error reading files
  }
  
  return undefined
}

async function hasStorybook(componentPath: string): Promise<boolean> {
  try {
    const files = await readdir(componentPath)
    return files.some(file => file.endsWith('.stories.tsx'))
  } catch {
    return false
  }
}

async function generateComponentData() {
  console.log('🔍 Scanning SmartHR UI components...')
  console.log(`Source: ${COMPONENTS_PATH}`)
  
  const components: ComponentInfo[] = []
  
  try {
    const pattern = join(COMPONENTS_PATH, '**')
    const paths = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/*.test.*', '**/*.stories.*', '**/stories/**'],
      absolute: true
    })
    
    for (const path of paths) {
      if (await isComponentDirectory(path)) {
        const componentName = basename(path)
        const category = categorizeComponent(componentName)
        const description = await getComponentDescription(path)
        const deprecated = description?.toLowerCase().includes('@deprecated') || false
        
        components.push({
          name: componentName,
          category,
          description,
          hasStorybook: await hasStorybook(path),
          deprecated
        })
        
        console.log(`  ✅ ${componentName} (${category})`)
      }
    }
    
    // Sort components by category and name
    components.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      return a.name.localeCompare(b.name)
    })
    
    // Write to JSON file
    await writeFile(OUTPUT_PATH, JSON.stringify(components, null, 2))
    
    console.log(`\n📦 Generated ${components.length} components`)
    console.log(`📝 Written to: ${OUTPUT_PATH}`)
    
    // Show category breakdown
    const categories = components.reduce((acc, comp) => {
      acc[comp.category] = (acc[comp.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('\n📊 Category breakdown:')
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`)
    })
    
  } catch (error) {
    console.error('❌ Error generating component data:', error)
    process.exit(1)
  }
}

generateComponentData()