export type Keywords = string | string[];
export type GetDescription = (word: string) => string;

export interface MarkManConfig {
  keywords: Keywords;
  getDescription?: GetDescription;
}
