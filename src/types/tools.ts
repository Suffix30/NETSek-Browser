import { z } from 'zod';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'network' | 'subdomain' | 'service' | 'cloud' | 'application' | 'wireless' | 'misc';
  command: string;
  args?: ToolArgument[];
}

export interface ToolArgument {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  default?: string | number | boolean;
  required?: boolean;
}

export interface ToolResult {
  id: string;
  toolId: string;
  timestamp: number;
  target: string;
  output: string;
  parsedOutput?: any;
  status: 'running' | 'completed' | 'error';
  headers?: {
    request: Record<string, string>;
    response: Record<string, string>;
  };
}

export interface BrowserState {
  url: string;
  history: string[];
  currentIndex: number;
  activeTab: number;
  tabs: Array<{
    id: number;
    url: string;
    title: string;
  }>;
}

export const ToolConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  command: z.string(),
  args: z.array(z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['string', 'number', 'boolean']),
    default: z.union([z.string(), z.number(), z.boolean()]).optional(),
    required: z.boolean().optional(),
  })).optional(),
});

export type ToolConfig = z.infer<typeof ToolConfigSchema>;