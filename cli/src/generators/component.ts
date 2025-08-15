import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';

export interface ComponentOptions {
  directory?: string;
  type?: string;
  tests?: boolean;
  styles?: boolean;
}

const componentTemplate = `import React{{#if useHooks}}, { useState, useEffect }{{/if}} from 'react';
{{#if hasStyles}}import styles from './{{pascalName}}.module.css';{{/if}}

export interface {{pascalName}}Props {
  /**
   * The title to display
   */
  title?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Child components
   */
  children?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * {{pascalName}} Component
 * 
 * @param props - Component props
 * @returns JSX Element
 */
export const {{pascalName}}: React.FC<{{pascalName}}Props> = ({
  title = '{{pascalName}}',
  className = '',
  children,
  onClick
}) => {
  {{#if useHooks}}
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Component mounted
    console.log('{{pascalName}} component mounted');
    
    return () => {
      // Cleanup
      console.log('{{pascalName}} component unmounted');
    };
  }, []);

  const handleClick = () => {
    setIsActive(!isActive);
    onClick?.();
  };
  {{/if}}

  return (
    <div 
      className="{{kebabName}}"
      {{#if useHooks}}onClick={handleClick}{{else}}onClick={onClick}{{/if}}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          {{#if useHooks}}handleClick();{{else}}onClick?.();{{/if}}
        }
      }}
    >
      <h2>{{#if hasStyles}}\{styles.title}{{else}}{{kebabName}}__title{{/if}}>{title}</h2>
      
      <div className="{{#if hasStyles}}\{styles.content}{{else}}{{kebabName}}__content{{/if}}">
        {children || (
          <p>
            This is the {{pascalName}} component.{{#if useHooks}}
            Status: {isActive ? 'Active' : 'Inactive'}{{/if}}
          </p>
        )}
      </div>
      
      {{#if useHooks}}
      <div className="{{#if hasStyles}}\{styles.status}{{else}}{{kebabName}}__status{{/if}}">
        <span>Click to toggle: {isActive ? '✅' : '⭕'}</span>
      </div>
      {{/if}}
    </div>
  );
};

export default {{pascalName}};
`;

const styleTemplate = `.{{camelName}} {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.{{camelName}}:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.{{camelName}}.active {
  border-color: #28a745;
  background-color: #f8fff9;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
}

.title {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.content {
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.5;
}

.status {
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.875rem;
  color: #888;
}

.status span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
`;

const testTemplate = `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {{pascalName}} from '../{{pascalName}}';

describe('{{pascalName}} Component', () => {
  it('renders with default props', () => {
    render(<{{pascalName}} />);
    
    expect(screen.getByText('{{pascalName}}')).toBeInTheDocument();
    expect(screen.getByText(/This is the {{pascalName}} component/)).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Title';
    render(<{{pascalName}} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childText = 'Custom child content';
    render(
      <{{pascalName}}>
        <p>{childText}</p>
      </{{pascalName}}>
    );
    
    expect(screen.getByText(childText)).toBeInTheDocument();
    expect(screen.queryByText(/This is the {{pascalName}} component/)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<{{pascalName}} className={customClass} />);
    
    const component = screen.getByRole('button');
    expect(component).toHaveClass(customClass);
  });

  {{#if useHooks}}
  it('toggles active state on click', () => {
    render(<{{pascalName}} />);
    
    const component = screen.getByRole('button');
    
    // Initially inactive
    expect(screen.getByText(/Status: Inactive/)).toBeInTheDocument();
    expect(screen.getByText(/⭕/)).toBeInTheDocument();
    
    // Click to activate
    fireEvent.click(component);
    
    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
    expect(screen.getByText(/✅/)).toBeInTheDocument();
  });

  it('toggles active state on Enter key', () => {
    render(<{{pascalName}} />);
    
    const component = screen.getByRole('button');
    
    fireEvent.keyDown(component, { key: 'Enter' });
    
    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  });

  it('toggles active state on Space key', () => {
    render(<{{pascalName}} />);
    
    const component = screen.getByRole('button');
    
    fireEvent.keyDown(component, { key: ' ' });
    
    expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  });
  {{/if}}

  it('calls onClick handler when provided', () => {
    const mockClick = jest.fn();
    render(<{{pascalName}} onClick={mockClick} />);
    
    const component = screen.getByRole('button');
    fireEvent.click(component);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
`;

const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import {{pascalName}} from './{{pascalName}}';

const meta: Meta<typeof {{pascalName}}> = {
  title: 'Components/{{pascalName}}',
  component: {{pascalName}},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable {{pascalName}} component with interactive features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomTitle: Story = {
  args: {
    title: 'Custom {{pascalName}} Title',
  },
};

export const WithChildren: Story = {
  args: {
    children: (
      <div>
        <p>This is custom content inside the {{pascalName}} component.</p>
        <button>Custom Button</button>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'border-2 border-blue-500',
    title: 'Styled {{pascalName}}',
  },
};
`;

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export async function generateComponent(
  name: string,
  options: ComponentOptions = {}
): Promise<void> {
  console.log(chalk.blue(`🧩 Generiere Komponente: ${name}`));

  const {
    directory = 'src/components',
    type = 'functional',
    tests = true,
    styles = true,
  } = options;

  // Namen verarbeiten
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  const camelName = toCamelCase(name);
  const kebabName = toKebabCase(name);
  const useHooks = type === 'functional';

  // Template-Daten
  const templateData = {
    name: name.toLowerCase(),
    pascalName,
    camelName,
    kebabName,
    useHooks,
    hasStyles: styles,
  };

  // Dateipfade
  const frontendPath = path.join(process.cwd(), 'frontend');
  const componentDir = path.join(frontendPath, directory, pascalName);
  const componentPath = path.join(componentDir, `${pascalName}.tsx`);
  const stylePath = path.join(componentDir, `${pascalName}.module.css`);
  const testPath = path.join(componentDir, `${pascalName}.test.tsx`);
  const storyPath = path.join(componentDir, `${pascalName}.stories.tsx`);
  const indexPath = path.join(componentDir, 'index.ts');

  // Verzeichnis erstellen
  await fs.ensureDir(componentDir);

  // Templates kompilieren und Dateien schreiben
  const componentCompiled = Handlebars.compile(componentTemplate);
  await fs.writeFile(componentPath, componentCompiled(templateData));
  console.log(chalk.green(`  ✓ Komponente erstellt: ${componentPath}`));

  if (styles) {
    const styleCompiled = Handlebars.compile(styleTemplate);
    await fs.writeFile(stylePath, styleCompiled(templateData));
    console.log(chalk.green(`  ✓ Styles erstellt: ${stylePath}`));
  }

  if (tests) {
    const testCompiled = Handlebars.compile(testTemplate);
    await fs.writeFile(testPath, testCompiled(templateData));
    console.log(chalk.green(`  ✓ Tests erstellt: ${testPath}`));
  }

  // Storybook Story (optional)
  const storyCompiled = Handlebars.compile(storyTemplate);
  await fs.writeFile(storyPath, storyCompiled(templateData));
  console.log(chalk.green(`  ✓ Storybook Story erstellt: ${storyPath}`));

  // Index-Datei für einfachen Import
  const indexContent = `export { default } from './${pascalName}';\nexport type { ${pascalName}Props } from './${pascalName}';\n`;
  await fs.writeFile(indexPath, indexContent);
  console.log(chalk.green(`  ✓ Index-Datei erstellt: ${indexPath}`));

  // Informationen anzeigen
  console.log(chalk.yellow(`\n💡 Nächste Schritte:`));
  console.log(chalk.gray(`  1. Komponente importieren:`));
  console.log(
    chalk.gray(`     import ${pascalName} from '${directory}/${pascalName}';`)
  );
  console.log(chalk.gray(`  2. In Parent-Komponente verwenden:`));
  console.log(chalk.gray(`     <${pascalName} title="Mein Title" />`));
  if (tests) {
    console.log(chalk.gray(`  3. Tests ausführen:`));
    console.log(chalk.gray(`     npm run test -- ${pascalName}`));
  }
}
