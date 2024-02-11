import { Item } from "./item";

export interface Genre extends Item {
  type: "genre";
  id: number;
  name: string;
}
