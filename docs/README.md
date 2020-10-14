# Documentation 

<video controls="controls">
  <source type="video/mp4" src="./intro.mp4"></source>
  <p>Your browser does not support the video element.</p>
</video>

# Development 

For easy development, use the `docker-compose.yml`.  
Build the project  
```BASH
yarn watch
```

In a terminal - 
`docker-compose up -d`
Grafana will start on port 3000 with user/pass = `admin`  
The plugin project will be mounted inside the docker container so changes are reflected immediately.  
Add a new dashboard with the diagram plugin to test changes.  

Open the plugin files in your favorite editor and make changes.  
Refresh your browser to see the diagram plugin changes.  

### Building Locally
1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```
3. Build plugin in production mode
```BASH
yarn build
```
