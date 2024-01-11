import csv
import pandas as pd
import numpy as np

two_mode_data = 'dataset/anime-dataset-2023.csv'


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


if __name__ == '__main__':
    data = df_from_array(np.array(read_data(two_mode_data)))

    print(data.columns)
