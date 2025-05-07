# Assignment - Internet of Things

Hardware and sensors are constantly added to our lives. Sensors produce data that often needs to be collected and analyzed. Having a basic knowledge of IoT protocols opens many doors for exciting projects as a web developer. 

This assignment focuses on analyzing IoT data and visualizing it on a web-based dashboard using a cloud platform. It aims to enhance your understanding of IoT data, API integration, and web-based data visualization.

## Description

You will receive data from Temp and Humidity, and Total Volatile Organic Compounds Sensor (TVOC) connected via WiFi gateway to MQTT broker. You need to subscribe to the MQTT broker. Create a web interface for this data and visualize it on a chart.

You can set up open-source tools to make collection, storage, and graphing such as The TIG (Telegraf, Influx, and Grafana) Stack, or explore alternative tools and methods that align with your interests and expertise.

## Assignment Tasks

1. **Subscribe to the provided MQTT broker** to receive real-time data from a Temp and Humidity, and TVOC sensor.

    MQTT broker details: 
   - mqtt://cscloud7-148.lnu.se:1883
   - user: iotlab
   - pass: iotlab
   - topic: 'data/1dv027' which holds temperature and humidity. Considering adding TVOC from another sensor aswell on a different topic.
    format: json

2. **Analyze the incoming data**, which includes:
    - Temp and Humidity
    - TVOC levels
    - Timestamp of each reading

3. **Choose Your Toolset:**
    You can pick one of the following approaches to process, store, and visualize the data.

    ### Option 1: Telegraf + InfluxDB + Grafana (TIG Stack)
    - **Telegraf**: Configure Telegraf to subscribe to the MQTT topic and collect data from the broker.
    - **InfluxDB**: Store the incoming sensor data in InfluxDB, a time-series database.
    - **Grafana**: Create a professional-grade dashboard in Grafana to visualize the CO2 and TVOC levels. Use features like real-time charts, dynamic thresholds, and historical data exploration.


    ### Option 2: Node.js + MongoDB + Frontend framework
    - **MongoDB**: Use MongoDB to store sensor data. Explore and pick a strategy to optimize mongo for time-series data. 
    - **Node.js**: Employ Node.js with MQTT.js to subscribe to the MQTT broker and process data into MongoDB.
    - **React.js/Next.js/Angular etc**: Design a custom web interface with dynamic features like filtering and real-time updates.
    - **Chart.js/D3.js**: Visualize data using Chart.js or D3.js for interactive charts and graphs.
        
## Deliverables

1. **Functional Dashboard:**
    - A url to a dashboard built using the selected toolset.

2. **Configuration Files:**
    - For TIG Stack: Provide the Telegraf configuration file, InfluxDB setup details, and Grafana dashboard export file.
    - Provide the MongoDB schema or collection structure for storing sensor data.
    - Share any necessary backend configuration files or scripts for connecting to MongoDB and processing data.
    
3. **Documentation:**
    - Explain the setup process for your selected tool.
    - Describe how data flows from the MQTT broker to your dashboard. 
    - Describe the optimizations implemented for handling time-series data

## Merge Request
You hand in the assignment by making a Merge Request of your project against the lnu/submit-branch. It is OK to have additional projects and repositories, but include a link to them in the Submission report.
Pay extra attention to including a link to your Assignment Report.

## Learning Outcomes

By completing this assignment, you will:
- Understand how to collect real-time data using MQTT.
- Learn how to store and manage IoT data efficiently.
- Gain hands-on experience with professional IoT tools.
- Develop skills in creating dashboards and visualizing sensor data.

