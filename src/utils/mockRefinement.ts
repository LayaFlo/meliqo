import type { GeneratedCreation, RefinementType } from "@/src/types/creation";

const REFINEMENT_PREFIX: Record<RefinementType, string> = {
  softer: "Softened version",
  darker: "Darker version",
  poetic: "More poetic version",
  shorter: "Shorter version",
};

export function refineMockCreation(
  creation: GeneratedCreation,
  refinement: RefinementType,
): GeneratedCreation {
  return {
    ...creation,
    id: Date.now().toString(),
    content: `${REFINEMENT_PREFIX[refinement]}

${creation.content}`,
    createdAt: new Date().toISOString(),
  };
}
