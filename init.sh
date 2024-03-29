#!/bin/bash

SHELL_CONFIGURATION=/home/"$USER"/.bashrc

mkdir -p dataset

if [ ! -e dataset/anime-dataset-2023.csv ]; then
    echo "Download dataset/anime-dataset-2023.csv first!"
    exit 1
fi

if [ ! -e dataset/user-filtered.csv ]; then
    echo "Download dataset/user-filtered.csv first"
    exit 1
fi

# install pyenv

if ! command -v pyenv &> /dev/null; then
    echo "Pyenv not detected installing..."
    rm -rf ~/.pyenv
    curl https://pyenv.run | bash
    
    echo "
# pyenv config
export PYENV_ROOT=\"\$HOME/.pyenv\"
[[ -d \$PYENV_ROOT/bin ]] && export PATH=\"\$PYENV_ROOT/bin:\$PATH\"

eval \"\$(pyenv init -)\"
eval \"\$(pyenv virtualenv-init -)\"" >> $SHELL_CONFIGURATION
      
    echo "Source the ~/.bashrc config and run script onece again to complete the setup"
    exit 0
fi

pyenv install -s 3.12.1
pyenv virtualenv 3.12.1 ml-anime &> /dev/null
pyenv local ml-anime || exit 1

# install jupyter

pip install jupyter jupyter-contrib-core jupyter_contrib_nbextensions nbstripout
# jupyter contrib nbextension install || exit 1

# install dependencies

pip install pyarrow pandas scipy scikit-learn tqdm matplotlib networkx flake8

# install Flask

pip install Flask flask-cors

# Install jupyer vim bindings

# Create required directory in case (optional)
# mkdir -p $(jupyter --data-dir)/nbextensions

# if [ -e "$(jupyter --data-dir)/nbextensions/vim_binding" ]; then
  # git clone https://github.com/lambdalisue/jupyter-vim-binding $(jupyter --data-dir)/nbextensions/vim_binding
# fi

# jupyter nbextension enable vim_binding/vim_binding

# Install cleora

if [ ! -d cleora ]; then

  git clone https://github.com/BaseModelAI/cleora.git
  cd cleora && cargo build --release && cd ..

  ln -s $(pwd)/cleora/target/release/cleora ./cleora-exe

fi

# Get npm packages

cd ml-frontend && npm install && cd ..

echo "Done"
echo "Next steps: you will need global angular cli package"
echo "\$ sudo npm install -g @angular/cli"
