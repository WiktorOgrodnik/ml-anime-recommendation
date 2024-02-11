import { Item } from "./item";

export interface Anime extends Item {
  type      : "anime"
  id        : number,
  name      : string,
  year      : number,
  genres    : string,
  image_url : string,
}

export class AnimeImpl implements Anime {
  type : "anime" = "anime";
  id = 0;
  name = "";
  year = 0;
  genres = "";
  image_url = "../../assets/boy.jpg"

  constructor(name: string) {
    this.name = name;
  }
}
