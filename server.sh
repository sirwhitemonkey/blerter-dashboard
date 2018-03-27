#!/bin/bash

#replace host
gulp replace-host --source $SERVICE_HOST --type rest
gulp replace-host --source $DASHBOARD_HOST --type grpc

node server.js
