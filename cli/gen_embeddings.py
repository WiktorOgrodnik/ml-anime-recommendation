import pandas as pd
import os
import shutil
import subprocess

from typing import Optional


USERS_CSV = "dataset/user-filtered.csv"
RATING_THRESHOLD = 6
TSV_FILENAME = "data2.tsv"


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
            lines: Optional[int] = None,
            rating_threshold: int = 6):

        self.users_df = users_df.head(int(lines)) \
                        if lines is not None else users_df

        def adj_mult(rating: int) -> int:
            match rating:
                case 6 | 7: return 1
                case 8 | 9: return 2
                case 10: return 3
                case _: return 0
    
        def agg_fun(anime: str, rating: int) -> str:
            return " ".join([str(anime)] * adj_mult(rating))

        self.users_df['id_rating'] = list(zip(self.users_df['anime_id'], self.users_df['rating']))

        self.grouped_df = self.users_df[self.users_df.rating >= rating_threshold]                 \
            .groupby("user_id")["id_rating"]                                                      \
            .agg(lambda animes: " ".join([agg_fun(anime, rating) for (anime, rating) in animes])) \
            .reset_index()

        return self.number_of_users()

    def from_csv(self, file: str):
        self.tsv_filename = file
        self.grouped_df = pd.read_csv(file,
                                      sep="\t",
                                      header=None,
                                      names=self.grouped_columns)

    def choose(self, nousers: int):
        self.grouped_df = self.grouped_df.sample(n=nousers)

    def cleora_train(self, cleora_exe="cleora", dimensions = 32, iter = 16):
        if self.tsv_filename is None:
            raise RuntimeError("TSV filename not yet created")
        if not os.access(cleora_exe, os.X_OK) and shutil.which(cleora_exe) is None:
            raise RuntimeError("cleora executable not found")

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


def load_users(filepath):
    return pd.read_csv(filepath, sep=',')


if __name__ == "__main__":
    
    users_df = load_users(USERS_CSV)
    
    model = AnimeRecomendation()
    model.fit(users_df, lines=4000000, rating_threshold=RATING_THRESHOLD)
    model.choose(10000)

    model.save_to_tsv(TSV_FILENAME)

    model.cleora_train(dimensions = 32, iter = 16)
