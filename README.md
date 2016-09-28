# grafana-diagram

This is a Grafana panel plugin that integrates the mermaid.js library.



A diagram can be defined using the Mermaid JS syntax.  
Metric series are used to color the background of the shape/node.  
The target or 'alias' of the series is compared to the ID of the diagram node to find a match, then applies a 'fill' style to the shape.  

Currently only the 'avg' of a series is considered for the threshold, and there are no series overrides.  

Roadmap -  
- Add series overrides for thresholds.  
- Add other metric summaries like max/min  
- [suggest something] 

Diagram Definition  
<<<<<<< HEAD
![Diagram Definition](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_definition.PNG?raw=true)
=======
![Diagram Definition](./src/img/diagram_definition.PNG?raw=true)
>>>>>>> branch 'master' of https://github.com/jdbranham/grafana-diagram.git

Diagram Display Options  
<<<<<<< HEAD
![Diagram Display Options](https://raw.githubusercontent.com/jdbranham/grafana-diagram/master/src/img/diagram_display.PNG?raw=true)  
=======
![Diagram Display Options](./src/img/diagram_display.PNG?raw=true)  
>>>>>>> branch 'master' of https://github.com/jdbranham/grafana-diagram.git


Special thanks to the Mermaid contributors -  
https://github.com/knsv/mermaid/graphs/contributors  
https://knsv.github.io/mermaid/  

and the D3 contributors -  
https://github.com/d3/d3/graphs/contributors  
http://grafana.org/
