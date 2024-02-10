#!/bin/bash

python "ml-backend/server.py" &
cd ml-frontend && ng serve --open
