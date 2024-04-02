#!/bin/bash

node ace migration:run

node ace db:seed

npm run dev