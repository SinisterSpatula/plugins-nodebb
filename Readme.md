# Plugin-ins for NodeBB

### Installation

```
cd NodeBB
git clone https://github.com/SinisterSpatula/plugins-nodebb.git
```

Use the [.docker-dev](https://github.com/SinisterSpatula/.docker-dev) to run the container with the plugins installed in a local docker development environment.

To run the plugins in production, you'll need to install them in the container, and use npm link to link the plugins into the /usr/src/app/node_modules directory.
