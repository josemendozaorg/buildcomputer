import type { Meta, StoryObj } from "@storybook/react";
import Layout from "../src/components/Layout";

const meta = {
  title: "Components/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithContent: Story = {
  args: {
    children: (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="mt-4">This is an example of content within the layout.</p>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    children: <div className="container mx-auto px-4 py-8">Empty layout</div>,
  },
};
