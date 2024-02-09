export interface Anime {
  id        : number,
  name      : string,
  year      : number,
  genres    : string,
  image_url : string,
}

export class AnimeImpl implements Anime {

  id = 0;
  name = "";
  year = 0;
  genres = "";
  image_url = "../../assets/boy.jpg"

  constructor(name: string) {
    this.name = name;
  }
}
