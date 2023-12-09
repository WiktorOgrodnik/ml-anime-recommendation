mkdir -p dataset

if [ ! -e dataset/anime-dataset-2023.csv ]; then
    echo "Download dataset/anime-dataset-2023.csv first!"
    exit 1
fi

# install 

if ! command -v pyenv &> /dev/null; then
    echo "Pyenv not detected installing..."
    curl https://pyenv.run | bash
    exec "$SHELL"
fi

pyenv install -s -v 3.11.6
pyenv virtualenv 3.11.6 ml-anime &> /dev/null
pyenv local ml-anime

# install jupyter

pip install jupyter

# install dependencies

pip install pandas scipy tqdm matplotlib networkx

echo "Done"
