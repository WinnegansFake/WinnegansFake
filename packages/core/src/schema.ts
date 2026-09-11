/**
 * schema.ts
 * Programmatic JSON Schema generator and default schema definition for book annotations.
 */

export interface SchemaCustomizationOptions {
  maxTargetPhraseLength?: number;
  minAnnotationTextLength?: number;
  maxLinesPerPage?: number;
  maxPageNumber?: number;
}

/**
 * Returns a configured JSON Schema for page annotation validation.
 */
export function getPageAnnotationJsonSchema(options: SchemaCustomizationOptions = {}): Record<string, unknown> {
  const {
    maxTargetPhraseLength = 150,
    minAnnotationTextLength = 10,
    maxLinesPerPage = 50,
    maxPageNumber = 2000,
  } = options;

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "PageAnnotation",
    description: "Standard coordinate-based annotations for a single page of text.",
    type: "object",
    required: ["schema_version", "page_number", "annotations"],
    properties: {
      schema_version: {
        type: "string",
        pattern: "^\\d+\\.\\d+\\.\\d+$",
        description: "Semantic version of the annotation schema."
      },
      book: {
        type: ["integer", "string"],
        description: "Book, volume, or major division identifier."
      },
      chapter: {
        type: ["integer", "string"],
        description: "Chapter, canto, or section identifier."
      },
      page_number: {
        type: "integer",
        minimum: 1,
        maximum: maxPageNumber,
        description: "Standard canonical printed page coordinate."
      },
      annotations: {
        type: "array",
        items: {
          type: "object",
          required: [
            "id",
            "line_number",
            "target_phrase",
            "annotation_text",
            "categories",
            "contributors"
          ],
          properties: {
            id: {
              type: "string",
              pattern: "^\\d{1,4}\\.\\d{1,2}(-[a-zA-Z0-9_-]+)?$",
              description: "Unique annotation ID formatted as PPP.LL or PPP.LL-suffix."
            },
            line_number: {
              type: "integer",
              minimum: 1,
              maximum: maxLinesPerPage,
              description: "Line number on the page."
            },
            target_phrase: {
              type: "string",
              minLength: 1,
              maxLength: maxTargetPhraseLength,
              description: "Target lemma or anchor phrase. Limited in length to avoid copyrighted reproductions."
            },
            annotation_text: {
              type: "string",
              minLength: minAnnotationTextLength,
              description: "Scholarly commentary, gloss, translation, or critical note."
            },
            categories: {
              type: "array",
              items: {
                type: "string",
                pattern: "^[a-z0-9-]+$"
              },
              minItems: 1,
              description: "Analytical registers or thematic categories."
            },
            cross_references: {
              type: "array",
              items: {
                type: "string",
                pattern: "^\\d{1,4}\\.\\d{1,2}$"
              },
              description: "Coordinates of related passages (e.g. PPP.LL)."
            },
            sources: {
              type: "array",
              items: {
                type: "string",
                minLength: 3
              },
              description: "Academic or bibliographic sources cited."
            },
            contributors: {
              type: "array",
              items: {
                type: "string",
                minLength: 1
              },
              minItems: 1,
              description: "Contributor usernames or attribution IDs."
            }
          }
        }
      }
    }
  };
}

export const DEFAULT_PAGE_ANNOTATION_SCHEMA = getPageAnnotationJsonSchema();
