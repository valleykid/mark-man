export type Keywords = string | string[];
export type GetDescription = (kw: string) => string;

export interface MarkManConfig {
  keywords: Keywords;
  getDescription?: GetDescription;
}
