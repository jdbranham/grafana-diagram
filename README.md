# grafana-diagram

This is a Grafana panel plugin that provides a way to create flow-charts, sequence diagrams, and gantt charts by leveraging the mermaid.js library.



A diagram can be defined using the Mermaid JS syntax.  
Metric series are used to color the background of the shape/node.  
The target or 'alias' of the series is compared to the ID of the diagram node to find a match, then applies a 'fill' style to the shape.  
  

**Note - Special characters in an alias are replace with an underscore.
   
## Examples  

   
### Diagram  
  
![Diagram](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram.PNG?raw=true)  


  
### Diagram Definition  
  
![Diagram Definition](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_definition.PNG?raw=true)  


  
### Display Options  
  
![Diagram Display Options](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_display.PNG?raw=true)  


  
### Metrics  
  
Graphite Datasource  
![Metrics](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_metrics_graphite.PNG?raw=true) 


  
### Prometheus  
  
With prometheus, be sure to use the transformed alias [with underscores]  
Metric  
![Metrics](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_metrics_prometheus.PNG?raw=true)  

Example Diagram -  
![Prometheus Diagram](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_prometheus.PNG?raw=true)  
 
  
## Roadmap  
  
- [suggest something]  
  
## Thanks!  
  

Special thanks to the Mermaid contributors -  
https://github.com/knsv/mermaid/graphs/contributors  
https://knsv.github.io/mermaid/  

and the D3 contributors -  
https://github.com/d3/d3/graphs/contributors  

And especially the Grafana contributors -  
https://github.com/grafana/grafana/graphs/contributors   
http://grafana.org/  

