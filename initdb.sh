#!/bin/bash

#CREDITS: https://medium.com/@beld_pro/quick-tip-creating-a-postgresql-container-with-default-user-and-password-8bb2adb82342
# Immediately exits if any error occurs during the script
# execution. If not set, an error could occur and the
# script would continue its execution.
set -o errexit


# Creating an array that defines the environment variables
# that must be set. This can be consumed later via arrray
# variable expansion ${REQUIRED_ENV_VARS[@]}.
readonly REQUIRED_ENV_VARS=(
  "POSTGRES_USER"
  "POSTGRES_PASSWORD"
  "POSTGRES_DB"
)

# Main execution:
# - verifies if all environment variables are set
# - runs the SQL code to create user and database
main() {
  check_env_vars_set
#  init_user_and_db
  create_tables
}


# Checks if all of the required environment
# variables are set. If one of them isn't,
# echoes a text explaining which one isn't
# and the name of the ones that need to be
check_env_vars_set() {
  for required_env_var in ${REQUIRED_ENV_VARS[@]}; do
    if [[ -z "${!required_env_var}" ]]; then
      echo "Error:
    Environment variable '$required_env_var' not set.
    Make sure you have the following environment variables set:
      ${REQUIRED_ENV_VARS[@]}
Aborting."
      exit 1
    fi
  done
}


# Performs the initialization in the already-started PostgreSQL
# using the preconfigured POSTGRE_USER user.
init_user_and_db() {
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER $FILLA_DB_USER WITH PASSWORD '$FILLA_DB_PASSWORD';
    CREATE DATABASE $FILLA_DB_DATABASE;
    GRANT ALL PRIVILEGES ON DATABASE $FILLA_DB_DATABASE TO $FILLA_DB_USER;
EOSQL
}

create_tables() {
  psql -v ON_ERROR_STOP --username "$POSTGRES_USER" -d "$POSTGRES_DB"<<-EOSQL
    CREATE TABLE IF NOT EXISTS qms(username VARCHAR PRIMARY KEY, email VARCHAR, phone VARCHAR, password VARCHAR, socket VARCHAR);
    CREATE TABLE IF NOT EXISTS rooms(roomid VARCHAR PRIMARY KEY, qm VARCHAR, state VARCHAR, FOREIGN KEY(qm) REFERENCES qms(username));
    CREATE TABLE IF NOT EXISTS users(username VARCHAR PRIMARY KEY, email VARCHAR, phone VARCHAR, roomid VARCHAR, socket VARCHAR, FOREIGN KEY(roomid) REFERENCES rooms(roomid));
    CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, roomid VARCHAR, question TEXT, options JSON, answer INTEGER, FOREIGN KEY(roomid) REFERENCES rooms(roomid));
    CREATE TABLE IF NOT EXISTS results(id SERIAL PRIMARY KEY, username VARCHAR, roomid VARCHAR, attempts JSON, total INTEGER, FOREIGN KEY(userid) REFERENCES users(username), FOREIGN KEY(roomid) REFERENCES rooms(roomid));
EOSQL
}

# Executes the main routine with environment variables
# passed through the command line. We don't use them in
# this script but now you know 🤓
main "$@"