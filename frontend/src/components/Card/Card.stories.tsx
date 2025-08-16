import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable Card component with interactive features.',
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
    title: 'Custom Card Title',
  },
};

export const WithChildren: Story = {
  args: {
    children: (
      <div>
        <p>This is custom content inside the Card component.</p>
        <button>Custom Button</button>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'border-2 border-blue-500',
    title: 'Styled Card',
  },
};
