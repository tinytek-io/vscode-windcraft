import { z } from "zod";

export const pluginConfigurationSchema = z.object({
  port: z.number().optional(),
});

export type PluginConfiguration = z.infer<typeof pluginConfigurationSchema>;
