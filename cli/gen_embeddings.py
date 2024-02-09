import pandas as pd
import os
import shutil
import subprocess
import argparse

from typing import Optional


USERS_CSV = "dataset/user-filtered.csv"
DEFAULT_RATING_THRESHOLD = 6
DEFAULT_TSV_FILENAME = "data2.tsv"
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
    parser.add_argument("--cleora", type=str, default="./cleora", help="cleora executable path")

    group = parser.add_mutually_exclusive_group()
    group.add_argument("-l", "--lines", type=int, default=DEFAULT_LINES, help="process first n lines of user dataset")
    group.add_argument("--all", action="store_const", const=None, dest="lines", help="process the whole user dataset")
    args = parser.parse_args()
    return args


class AnimeRecomendation:
    def __init__(self):
        self.users_df = pd.DataFrame()
        self.users_count = None
        self.columns = ["user", "anime"]
        self.grouped_columns = ["user_id", "id_rating"]
        self.tsv_filename = None

    def number_of_users(self):
        if self.users_count is None:
            self.users_count = self.users_df.max()['user_id']
        return self.users_count

    def save_to_tsv(self, tsv_filename: str):
        self.tsv_filename = tsv_filename
        self.grouped_df.to_csv(self.tsv_filename,
                               index=False,
                               sep='\t',
                               columns=self.grouped_columns,
                               mode='w',
                               header=False)

    def fit(self,
            users_df,
            rating_threshold: int = 6):

        self.users_df = users_df

        def adj_mult(rating: int) -> int:
            match rating:
                case 6 | 7: return 1
                case 8 | 9: return 2
                case 10: return 3
                case _: return 0

        def agg_fun(anime: str, rating: int) -> str:
            return " ".join([str(anime)] * adj_mult(rating))

        self.users_df['id_rating'] = list(zip(self.users_df['anime_id'], self.users_df['rating']))

        self.grouped_df = (self.users_df[self.users_df.rating >= rating_threshold]
            .groupby("user_id")["id_rating"]
            .agg(lambda animes: " ".join([agg_fun(anime, rating) for (anime, rating) in animes]))
            .reset_index())

        return self.number_of_users()

    def from_csv(self, file: str):
        self.tsv_filename = file
        self.grouped_df = pd.read_csv(file,
                                      sep="\t",
                                      header=None,
                                      names=self.grouped_columns)

    def choose(self, nousers: int):
        self.grouped_df = self.grouped_df.sample(n=nousers)

    def cleora_train(self, cleora_exe="./cleora", dimensions = 32, iter = 16):
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


def load_users(filepath, line_count: int | None):
    return pd.read_csv(filepath, sep=',', nrows=line_count)


if __name__ == "__main__":
    args = parse_args()
    print(f"Generating embeddings with {vars(args)}")

    users_df = load_users(USERS_CSV, args.lines)

    model = AnimeRecomendation()
    if args.skip_fit:
        model.tsv_filename = args.output
    else:
        model.fit(users_df, rating_threshold=args.rating_threshold)
        if args.choose is not None:
            model.choose(args.choose)

        model.save_to_tsv(args.output)

    if not args.skip_cleora:
        model.cleora_train(cleora_exe=args.cleora, dimensions=args.dimensions, iter=args.iter)
