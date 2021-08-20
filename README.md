# simean-docker
An example docker-compose environment for standing up the simaen service

## Directory Structure
```
simaen-docker
|   docker-compose.yml         # the default docker-compose yaml file to build simaen service
|   README.md                  # this document  
└───simaen-api                 # copy or use git submodules the simaen-api repository into this folder
└───simaen-db                  # used by the postgresql  to load sql and by simaen-api to load db credentials
│   │   postgres.json          # update this file with the postgresql credentials created in the docker-compose.yml 
│   │   simean-db-data.sql.gz  # pull from git lfs or replace with the 500MB+ simean-db-data.sql.gz, initializes db
└───simaen-web                 # copy or use git submodules the simaen-api repository into this folder
```
- Ensure there are two subfolders with the contents of simaen-api and simaen-web repositories
- Ensure simaen-db/simaen-db-data.sql.gz is a large 500MB+ file otherwise replace with the original file. This is a db dump of the tables aggregate_data, parameters and run_data. 
  - `pg_dump --data-only simaen -f simaen-db-data.sql -t 'aggregate_data' -t 'parameters' -t 'run_data'`
  - `gzip simaen-db-data.sql`

## Minimum Requirements
- Docker Engine 17.05+  (simaen-web uses a multi-stage container for dev and prod targets)
- Docker Compose 1.25.5+ or Docker Desktop v3.4.0+ (docker compose v2 beta)
- Red Hat Developer Account (Free) to pull down base containers  'docker login https://registry.redhat.io'

## Usage
There are a number of variables configured in the docker-compose.yml and we haven't configured a way to use .env files since there are  hardcoded urls/ports/creds in a few files that need to be modified for use outside of hosting as "localhost".

The example docker-compose.yml is configured to build the web services with 'target: prod' that launches an apache webserver which serves static files and reverse proxies the simean api. When you change the build variable to 'target: dev', it will build with the intent of local developement on a laptop/desktop. It is not advisable to ever use 'target: dev' on a server for the service to be shared and it may cause a lot of confusion.

Always to add the --build parameter to 'docker-compose up -d ' to rebuild containers when variables are changed.

### build and start services
`docker-compose up -d --build`
- This will build containers and start all services
- You may also use this when changing variables or editing Dockerfiles or simply starting the services back up
### stop services
- This will not destroy containers or postgresql pgdata volume
`docker-compose stop`
### destroy containers
`docker-compose down`
- This will stop and destroy all containers built, but NOT the pgdata volume
### destroy containers and pgdata volume
`docker-compose down -v
- This will stop and destroy all containers built AND the pgdata volume!

## Docker Compose Configurations
### web
```
    build:
      context: ./simaen-web/
      #target: dev
      target: prod
```
- The 'prod' target builds an apache webserver with static files listening on http tcp/8080 and https tcp/8443
  - The apache webserver will reverse proxy /api to the simaen-api service built using this docker-compose file. This is currently hardcoded in the Dockerfile of simaen-web.
     - `RUN echo 'ProxyPass /api http://simaen-api:5000/api' >> /etc/httpd/conf/httpd.conf`
    `RUN echo 'ProxyPassReverse /api http://simaen-api:5000/api' >> /etc/httpd/conf/httpd.conf`
  - Without adding additional certificates via bind mounts to the docker-compose.yml, the container will use self signed certificates, [see the complete guide to modifying the base image Apache httpd 2.4](https://catalog.redhat.com/software/containers/ubi8/httpd-24/6065b844aee24f523c207943?container-tabs=overview#31-to-use-own-setup-create-a-dockerfile-with-this-content) 
- The 'dev' target builds a create-react-app dev server listening on http tcp/8080 in this example.

```
    environment:
      PORT: 8080 # used only for dev target
      REACT_APP_API_URL: https://localhost/api # must be fqdn of website to api
```
- PORT is only used for the create-react-app dev server listening port
- REACT_APP_API_URL must be the public (web browser) facing URL of the simaen api service.
  - Usually when target is dev, this will be http://localhost:5000/api
  - When using target prod, you must make this the desired fqdn facing website and the /api. This example is using https://localhost/api.
  - When this variable is changed you MUST rebuild the web container

### db
```
    ports:
      # not required for prod or dev, only required to connect from host/other
      - "5432:5432"
```
- You may leave this out. This exposes the database to the host running docker, its not required to actually run the service since the services all interact on docker internal network. One may use docker exec commands to export the database files to a new bind mount directory if wanted.
```
    environment:
      POSTGRES_DB: simaen
      POSTGRES_PASSWORD: password
      POSTGRES_USER: simaen
```
- You may change these variables but you must update simaen-db/postgres.json and rebuild the api container.
```
    volumes:
      - "simaen-db-pgdata:/var/lib/postgresql/data"
```
```
volumes:
  simaen-db-pgdata:
```
- We are using a docker volume to store the postgresql data, not a bind mount to the filesystem. The way the container works is if doesn't find existing data in the pgdata volume, it will initialize the database and run through the two sql ingests that are bind mounted from ./simean-api/schema.sql and ./simaen-db/simaen-db-data.sql.gz. If it finds data in the pgdata volume, it will not reinitizalize the database.
### api
```
    ports:
     - "5000:5000"
```
- You may leave this out for target prod, however the target dev builds require this since the frontend browser will be directly accessing the api without an apache webserver to reverse proxy.
```
    environment:
      PORT: 5000     
```
- If you change this port you must change it as well in the Dockerfile of simaen-web when target is prod. You MUST rebuild the web container when this changes.
     - `RUN echo 'ProxyPass /api http://simaen-api:5000/api' >> /etc/httpd/conf/httpd.conf`
    `RUN echo 'ProxyPassReverse /api http://simaen-api:5000/api' >> /etc/httpd/conf/httpd.conf`
