# Stratum Deployment and Management Platform
Stratum comprises of rapid ML model development framework called Erudite, and a lifecycle management framework for data analytics applications. Stratum can deploy and manage application components, and ML-as-a-service (for inference jobs) across distributed systems in an event-driven manner. 


Sample Data Analytics Platform is shown here:
![alt text](https://github.com/doc-vu/Stratum/blob/master/png/ModelArch.png)

### Stratum contributions:
1. Stratum provides a Domain-Specific Modeling Language (DSML) to hide the lower-level details of infrastructure deployment and provides an easy to use web-interface for the end users to utilize the platform. Stratum support built-in 'correct-by-construction' using constraint checker. Stratum can validate the application deployment architecture by conducting a requirement-capability analysis on the target hardware before actual deployment.  
    
2. We present a rapid AI/ML model development framework, where the developers can connect to a wide range of data sources and build their own  AI/ML applications.  %Specifically, Stratum provides an AI/ML Service Encapsulation approach by leveraging CPU and  GPU-enabled containerization architectures and API abstraction for common ML libraries and frameworks. It provides an easy-to-use framework on which developers can quickly build, train and evaluate the ML model on historical data requiring little to no code development.
    
3. Once the AI/ML model is ready and finalized, the application components can be exposed as RESTful APIs, and seamlessly integrated into the business application workflow using Stratum (as shown in Figure 1). Stratum manages the lifecycle of models efficiently and triggers retraining of the models also if the model becomes stale over time.
    
4. Stratum provides an intelligent way to transfer the trained model to the target machines (across the cloud-fog-edge spectrum) as an ML module for inference and analysis of incoming data sources. %ML module(s) can be placed on the edge devices for edge analytics, or at Cloud or Fog layer for live or in-depth analysis of data depending on user requirement and requirement-capability analysis. The serverless platform using declarative specifications handle all of these responsibilities.
    
5. Stratum takes care of dynamic resource management by providing a strategic design wherein other resource management algorithms can be plugged in.  It supports monitoring of data management and models in production by instrumenting finer-grained performance metrics collection on the target hardware.  Based on the collected performance metrics such as CPU, memory, IO utilization the resource management algorithms can enforce horizontal and vertical elasticity of resources to maintain the QoS requirements.  We validated these claims using our default resource management algorithms are enforced. 


Stratum collaborative and version-controlled environment
![alt text](https://github.com/doc-vu/Stratum/blob/master/png/collaboration.png)

Stratum core concepts are developed using WebGME which supports collaboration in a version-controlled environment. We also incorporated the automatic version control in Stratum framework so that we can recall a specific version of the framework later if required. We save data, code, and attributes of the modeling environment to guarantee that every state is reproducible. Because of collaborative editing support, the developers can easily tag branches when they are developing their part of the model, and the branches can be merged easily to integrate the whole model. Above figure shows an integrated version control for all developers to make any historical state reproducible in the collaborative environment. 
