import type { Meta, StoryObj } from "@storybook/react";
import Button from "../src/components/Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Get Started",
  },
};

export const LongText: Story = {
  args: {
    children: "Start Building Your Dream Computer",
  },
};

export const ShortText: Story = {
  args: {
    children: "Go",
  },
};
