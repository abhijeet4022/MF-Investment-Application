# MF-Investment-Application
MF Investment Application

# MF-Investment-Application

This document provides instructions for deploying the MF-Investment-Application on a Linux server (Centos 9).

## Deployment Instructions

To deploy the MF-Investment-Application, follow the steps below:

### Prerequisites

- Ensure you are in `root` user on the server.
- Port `82` should be open for HTTP traffic and not listening on any other service.

### Steps to Deploy the Application

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abhijeet4022/MF-Investment-Application.git /tmp/mf-investment-application
   ```

2. **Navigate to Application Directory**
   ```bash
   cd /tmp/mf-investment-application
   ```

3. **Execute Deployment Script**
   ```bash
   sudo bash deploy.sh
   ```

4. **Application is now accessible at:**
   ```bash
   echo "http://$(hostname -I | awk '{print $1}'):82"
   ```

This script will handle all necessary deployment steps, including setting up the application, configuring the environment, and starting services.
