#!/bin/bash

# Function to stop Node.js server
stop_server() {
  echo "Stopping Node.js server with PID: $NODE_PID"
  kill -TERM "$NODE_PID"
  # wait "$NODE_PID"
  echo "Node.js server stopped"
}

# Start the Node.js server
npm start &
NODE_PID=$!
  echo "Node.js server started with PID: $NODE_PID"


# Sleep for 6 hours (6 * 60 * 60 seconds)
sleep 6 * 60 * 60

# Stop the Node.js server after 6 hours
stop_server
