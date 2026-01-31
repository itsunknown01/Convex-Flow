import jsonata from "jsonata";

export interface TransformStepDefinition {
  type: "TRANSFORM";
  expression: string;
}

export const executeTransformStep = async (
  step: TransformStepDefinition,
  input: any,
) => {
  try {
    const expression = jsonata(step.expression);
    const result = await expression.evaluate(input);
    return result;
  } catch (error: any) {
    throw new Error(`Transformation failed: ${error.message}`);
  }
};
