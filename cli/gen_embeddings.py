import pandas as pd
import os
import shutil
import subprocess
import argparse

ANIME_CSV="dataset/anime-dataset-2023.csv"
USERS_CSV = "dataset/user-filtered.csv"
DEFAULT_RATING_THRESHOLD = 6
DEFAULT_TSV_FILENAME = "data.tsv"
DEFAULT_LINES = 4000000
DEFAULT_DIM = 16
DEFAULT_ITER = 32


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dimensions", type=int, default=DEFAULT_DIM)
    parser.add_argument("-i", "--iter", type=int, default=DEFAULT_ITER)
    parser.add_argument("-c", "--choose", type=int)
    parser.add_argument("-o", "--output", type=str, default=DEFAULT_TSV_FILENAME, help="tsv output path")
    parser.add_argument("--rating-threshold", type=int, default=DEFAULT_RATING_THRESHOLD)
    parser.add_argument("--skip-fit", action="store_true")
    parser.add_argument("--skip-cleora", action="store_true")
    parser.add_argument("--cleora", type=str, default="./cleora-exe", help="cleora executable path")

    group = parser.add_mutually_exclusive_group()
    group.add_argument("-l", "--lines", type=int, default=DEFAULT_LINES, help="process first n lines of user dataset")
    group.add_argument("--all", action="store_const", const=None, dest="lines", help="process the whole user dataset")
    args = parser.parse_args()
    return args


class AnimeRecomendation:
    def __init__(self, users_df=pd.DataFrame(), animes_df=pd.DataFrame()):
        self.users_df = users_df
        self.animes_df = animes_df
        self.users_count = None
        self.columns = ['user', 'anime']
        self.grouped_columns = ['user_id', 'anime_id']
        self.tsv_filename = None
        self.popularity_threshold = 6000

    def change_data(self, users_df, animes_df):
        self.users_df = users_df
        self.animes_df = animes_df

        return self.number_of_users()

    def from_csv(self, file: str):
        self.tsv_filename = file
        self.grouped_df = pd.read_csv(file,
                                      sep="\t",
                                      header=None,
                                      names=self.grouped_columns)

    def choose(self, nousers: int):
        if nousers <= self.number_of_users():
            self.users_df = self.users_df.sample(n=nousers)

    def number_of_users(self):
        if self.users_count is None:
            self.users_count = self.users_df.max()['user_id']
        return self.users_count

    def fit(self,
            rating_threshold=6):

        def adj_mult(rating: int) -> int:
            match rating:
                case 6 | 7: return 1
                case 8 | 9: return 2
                case 10: return 3
                case _: return 0

        def agg_fun(anime: str, rating: int) -> str:
            return " ".join([str(anime)] * adj_mult(rating))

        self.animes_df = self.animes_df[(self.animes_df['Popularity'] <= self.popularity_threshold) &
                                        (self.animes_df['Popularity'] > 0)]

        self.users_df = self.users_df[self.users_df['rating'] >= rating_threshold]
        self.users_df = self.users_df[self.users_df['anime_id'].isin(self.animes_df['anime_id'])]
        self.animes_df = self.animes_df[self.animes_df['anime_id'].isin(self.users_df['anime_id'])]

        self.users_df = (self.users_df
            .assign(id_rating=lambda x: list(zip(x['anime_id'], x['rating'])))
            .groupby('user_id')['id_rating']
            .agg(lambda animes: " ".join([agg_fun(anime, rating) for (anime, rating) in animes]))
            .reset_index()
            .rename(columns={'id_rating': 'anime_id'}))

        self.animes_df = (self.animes_df
            .assign(genre=lambda x: x['Genres'].apply(lambda x: list(map(str.strip, x.split(",")))))
            .filter(items=['anime_id', 'genre'])
            .explode('genre')
            .groupby('genre')
            .agg(lambda genres: " ".join([str(i) for i in genres]))
            .reset_index()
            .rename(columns={'genre': 'user_id'}))

        self.grouped_df = self.users_df

        return self.number_of_users()

    def save_to_tsv(self, tsv_filename: str):
        self.tsv_filename = tsv_filename
        self.grouped_df.to_csv(self.tsv_filename,
                               index=False,
                               sep='\t',
                               columns=self.grouped_columns,
                               mode='w',
                               header=False)
        self.animes_df.to_csv("animes.tsv",
                               index=False,
                               sep='\t',
                               columns=self.grouped_columns,
                               mode='w',
                               header=False)

    def cleora_train(self, cleora_exe="./cleora-exe", dimensions=32, iter=16):
        if self.tsv_filename is None:
            raise RuntimeError("TSV filename not yet created")
        if not os.access(cleora_exe, os.X_OK) and shutil.which(cleora_exe) is None:
            raise RuntimeError(f"cleora executable not found: {cleora_exe}")

        command = [cleora_exe,
                   "--type", "tsv",
                   f"--columns=transient::{self.columns[0]} complex::{self.columns[1]}",
                   "--dimension", str(dimensions),
                   "--number-of-iterations", str(iter),
                   "--prepend-field-name", "0",
                   "-f", "numpy",
                   "-o", "results",
                   "-e", "1",
                   self.tsv_filename]
        subprocess.run(command, check=True)

        command = [cleora_exe,
                   "--type", "tsv",
                   f"--columns=transient::genre complex::anime",
                   "--dimension", "8",
                   "--number-of-iterations", str(iter),
                   "--prepend-field-name", "0",
                   "-f", "numpy",
                   "-o", "results",
                   "-e", "1",
                   "animes.tsv"]
        subprocess.run(command, check=True)


def load_pd(filepath, line_count: int | None):
    return pd.read_csv(filepath, sep=',', nrows=line_count)


if __name__ == "__main__":
    args = parse_args()
    print(f"Generating embeddings with {vars(args)}")

    users_df = load_pd(USERS_CSV, args.lines)
    animes_df = load_pd(ANIME_CSV, None)

    model = AnimeRecomendation(users_df=users_df, animes_df=animes_df)
    if args.skip_fit:
        model.tsv_filename = args.output
    else:
        if args.choose is not None:
            model.choose(args.choose)

        model.fit(rating_threshold=args.rating_threshold)
        model.save_to_tsv(args.output)

    if not args.skip_cleora:
        model.cleora_train(cleora_exe=args.cleora, dimensions=args.dimensions, iter=args.iter)
