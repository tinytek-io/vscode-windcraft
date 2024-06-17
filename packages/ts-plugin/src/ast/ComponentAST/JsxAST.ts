import { z } from "zod";

export namespace JsxAST {
  export const positionSchema = z.object({
    start: z.number(),
    end: z.number()
  });

  export type Position = z.infer<typeof positionSchema>;

  const expressionSchema = z.object({
    type: z.literal("expression"),
    expression: z.string(),
    position: positionSchema
  });

  const textSchema = z.object({
    type: z.literal("text"),
    value: z.string(),
    position: positionSchema
  });

  const elementPropsSchema = z.record(
    z.string(),
    z.object({
      value: z.string(),
      position: positionSchema
    })
  );

  export type ElementProps = z.infer<typeof elementPropsSchema>;

  const elementBaseSchema = z.object({
    type: z.literal("element"),
    name: z.string(),
    position: positionSchema,
    props: elementPropsSchema
  });

  type Expression = z.infer<typeof expressionSchema>;

  type Text = z.infer<typeof textSchema>;

  export type Element = z.infer<typeof elementBaseSchema> & {
    children?: Array<Element | Text | Expression>;
  };

  const elementSchema: z.ZodType<Element> = elementBaseSchema.extend({
    children: z.lazy(() => z.union([expressionSchema, textSchema, elementSchema]).array()).optional()
  });

  const propDefinitionSchema = z.record(
    z.string(),
    z.object({
      value: z.string(),
      position: positionSchema
    })
  );

  export type PropDefinition = z.infer<typeof propDefinitionSchema>;

  const componentSchema = z.object({
    type: z.literal("component"),
    name: z.string(),
    isExported: z.boolean(),
    position: positionSchema,
    props: propDefinitionSchema,
    return: elementSchema.array()
  });

  export type Component = z.infer<typeof componentSchema>;

  const fileSchema = z.object({
    fileName: z.string(),
    position: positionSchema,
    components: componentSchema.array()
  });

  export type File = z.infer<typeof fileSchema>;
}
