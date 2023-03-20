# First stage builds the application
FROM registry.access.redhat.com/ubi8/nodejs-16:1 as builder

# Add dependencies
COPY --chown=1001:1001 package*.json $HOME

RUN npm install -g @angular/cli

#### install project dependencies
RUN npm install


# Add application sources
COPY --chown=1001:1001 . $HOME

#### generate build --prod
RUN ng build --configuration=production --output-hashing=none && ng run globex-web:server:production --output-hashing=none

# Second stage copies the application to the minimal image
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:1

# ENV variables
# API_BASE_URL: URL of service to connect to
# HTTP_PORT: The http port this service listens on
ENV HTTP_PORT=8080 \
    NODE_ENV=prod

# Copy the application source and build artifacts from the builder image to this one
COPY --chown=1001:1001 --from=builder $HOME/dist $HOME/dist

# Expose the http port
EXPOSE 8080

# Run script uses standard ways to run the application
RUN pwd
RUN ls -a
CMD node ./dist/globex-web/server/main.js