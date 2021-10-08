#!/bin/bash

hugo --cleanDestinationDir
aws s3 sync --size-only --delete ./public s3://pmck.id.au/
