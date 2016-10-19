#!/bin/bash

# https://github.com/osterman/copyright-header

copyright-header \
    --license AGPL3 \
    --copyright-software "eatout" \
    --copyright-software-description "yummy places in the hood" \
    --copyright-holder "Maria Carrasco Rodriguez" \
    --copyright-year "2014-2016" \
    -a . \
    -r data \
    -o .
