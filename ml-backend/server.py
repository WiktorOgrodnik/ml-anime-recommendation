from flask import Flask
import csv
import pandas as pd
import numpy as np

two_mode_data = 'dataset/anime-dataset-2023.csv'
all_data = pd.DataFrame()


def read_data(file: str):
    with open(file, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        return [np.array([i] + list(row))
                for i, row in
                enumerate(reader, start=-1)]


def df_from_array(a):
    return pd.DataFrame(data=a[1:, 1:], index=a[1:, 0], columns=a[0, 1:])


def startup():

    global all_data

    raw_data = read_data(two_mode_data)
    all_data = df_from_array(np.array(raw_data))


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
    print(all_data.columns)
    return f"<h1>{all_data.columns}</h1>"


if __name__ == '__main__':
    app.run()
