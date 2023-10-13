# Online Store Web Application

With this application, I tried my best to replicate how an online store would work without the exception of a payment gateway. Users have the ability to interact and shop the store's offered content with persistent storage on shopping carts for users who are logged in, and one hour for guest users who are not logged in.

## How to use application

**Requirements**

1. MySql (MariaDB). You can use [XAMPP](https://www.apachefriends.org/download.html), [WAMP](https://www.wampserver.com/en/download-wampserver-64bits/#download-wrapper), or [MAMP](https://www.mamp.info/en/downloads/), or use the command line if you are comfortable with. 
2. Node.js Version 16.14.2 or higher - [Node.js](https://nodejs.org/en/download). 
3. VS Code - Optional. You can find it [here](https://code.visualstudio.com/download). 

### Step 1. Import Database

Assuming you have installed the prerequisites:

- Import the SQL data into your MySQL environment. You can find it [here](./Planning/SQL%20database/online-store-full-stack.sql) (/Planning/SQL database/online-store-full-stack.sql).

### Step 2. Navigate to Project directory

- Use the command-line and navigate to the project directory, OR use VS Code and open the project directory. 

### Step 3. Create .env file

- On the root directory create a .env file. Do not give it a name, just (.env). 

- Open the 'env example.txt' file and copy the contents.

```
DB_PASS=password
DB_USER=username
DB_HOST=localhost or 127.0.0.1 or your DB host of choice
DB_DATABASE=fullstack_ostore
SESSION_SECRET=Random string to encryt you user passwords
```

- Paste them in the .env file you just created and replace the values on the right of the equals sign with values for your environment and save, then exit. 

### Step 4. Install required node modules

- Run the command to install the required node module

```
npm i 
```

Wait until all the node modules have been installing.

- Then run the command to install nodemon

```
npm install -g nodemon 
```

Wait until nodemon has finished installing.

### Step 5. Run the application

- Run the command to start the server application

```
 npm start 
```

or

```
nodemon app.js 
```

or 

```
node app.js 
```


### Step 6. View on browser

- Open the browser and navigate to the site: 

[localhost:3000](localhost:3000)

## How to Close the Application

**First Method**

- On the command-line interface hit 

```'Ctrl + c'```
on windows / linus

or

```'Cmd + C'```
on Mac

- Then if it asks press 'y' and enter.

**Second Method**

- Close the command-line interface.
