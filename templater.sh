#!/bin/bash

TEMPDIR="tmpkustomize"

trap 'rm skaffold.yaml && rm -rf ./tmpkustomize' ERR EXIT

while getopts s:p:c: option
do
case "${option}"
in
    s) SYSTEM=${OPTARG};;
    p) PROFILE=${OPTARG};;
    c) COMMAND=${OPTARG};;
esac
done

if [[ $SYSTEM != "unix" && $SYSTEM != "linux" ]]; then
    echo "${SYSTEM} not supported"
    exit 1
fi

if [[ $PROFILE != "base" && $PROFILE != "development" && $PROFILE != "staging" && $PROFILE != "production" ]]; then
    echo "${PROFILE} not supported"
    exit 1
fi

# Set sudo to work whether logged in as root user or non-root user
if [[ $EUID == 0 ]]; then export SUDO=""; else export SUDO="sudo"; fi

if [[ $(command -v gettext) == "" ]]; then
    # Install envsubst
    if [[ $SYSTEM == "unix" ]]; then
    brew install gettext
    brew link --force gettext
    else
    $SUDO apt-get install gettext-base
    fi
fi

# Make temp dir
mkdir ${TEMPDIR}/
mkdir ${TEMPDIR}/base

# Convert file templates for base
for FILE in kustomize/base/*.yaml; 
do 
    envsubst < ./kustomize/base/$(basename "$FILE") > ${TEMPDIR}/base/$(basename "$FILE");
done

if [[ $PROFILE != "base" ]]; then
    mkdir "${TEMPDIR}/${PROFILE}"

    for FILE in kustomize/${PROFILE}/*.yaml; 
    do 
        envsubst < ./kustomize/${PROFILE}/$(basename "$FILE") > ${TEMPDIR}/${PROFILE}/$(basename "$FILE");
    done
fi

envsubst < ./skaffold.template.yaml > ./skaffold.yaml

$COMMAND
exit