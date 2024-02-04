from flask import Flask, jsonify
import pandas as pd
from dataclasses import dataclass, asdict


@dataclass
class Anime:
    id: int
    name: str
    image_url: str
    genres: str
    year: int


# importing data from csv to pandas
def from_csv(file: str) -> pd.DataFrame:
    return pd.read_csv(file)


pd.options.display.max_colwidth = 300


anime_data = 'dataset/anime-dataset-2023.csv'
anime_df = from_csv(anime_data)
example_animes = [1, 67, 1000]


def pandas_extract_content(row, label):
    name = row[label].to_string()
    return name.split("    ")[1]


def extract_year(aired):
    return aired.split(",")[1].split(" ")[1]


def get_anime_dict(anime_id: int):
    anime_row = anime_df[anime_df.anime_id == anime_id] \
        .filter(items=["anime_id", "Name", "Genres", "Image URL", "Aired"])

    anime = Anime(
        int(pandas_extract_content(anime_row, "anime_id")),
        pandas_extract_content(anime_row, "Name"),
        pandas_extract_content(anime_row, "Image URL"),
        pandas_extract_content(anime_row, "Genres"),
        int(extract_year(pandas_extract_content(anime_row, "Aired"))))

    return asdict(anime)


def startup():
    global all_data
    pass


class AnimeApp(Flask):
    def run(self,
            host=None,
            port=None,
            debug=None,
            load_dotenv=True,
            **options):
        with self.app_context():
            startup()
        super(AnimeApp, self).run(
                    host=host,
                    port=port,
                    debug=debug,
                    load_dotenv=load_dotenv,
                    **options
            )


app = AnimeApp(__name__)


@app.route("/")
def hello_world():
    return "<h1>Anime data server</h1>"


@app.route("/api/Anime/<int:anime_id>")
def get_anime(anime_id: int):
    return jsonify(get_anime_dict(anime_id)), 200


@app.route("/api/Animes")
def get_animes_test():
    return jsonify([get_anime_dict(i) for i in example_animes]), 200


if __name__ == '__main__':
    app.run()