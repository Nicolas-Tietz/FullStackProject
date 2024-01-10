How to Download and Install

Create a folder that will contain the Project.
In the terminal, go inside the just created folder.
From there execute:
git init
git pull https://github.com/Nicolas-Tietz/FullStackProject.git

Once done, you should have all the necessary files in the folder.

Now, go inside the backend folder, and execute this in the terminal:
npm install

Do the same thing inside the frontend folder.

Last thing to do, is create the .env file INSIDE THE BACKEND FOLDER, that needs to contain these 2 variables:

MONGO_DB_URL = 'YOUR_MONGODB_URL'
ACCESS_TOKEN_SECRET='YOUR_ACCESS_TOKEN'

The MONGO_DB_URL is the database connection string that you can find inside your MongoDb database.
For the ACCESS_TOKEN_SECRET i generated it like this:

In the terminal inside the frontend or backend folder, execute this:

node

require('crypto').randomBytes(64).toString('hex')

A string will be printed, you can now copy that and paste it inside the ACCESS_TOKEN_SECRET.

Code git init

Once done,

Rembemer to add the part to create the index for the search

.env must be created in the backend folder.

must contain
MONGO_DB_URL = 'YOUR_MONGODB_URL'
ACCESS_TOKEN_SECRET='YOUR_ACCESS_TOKEN'

While in the backend execute these commands to generate the ACCESS_TOKEN_SECRET:

node

Once inside node, write this:

require('crypto').randomBytes(64).toString('hex')

This line generates a string made of 64 random bytes that we'll use as ACCESS_TOKEN_SECRET.
