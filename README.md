Node and MongoDB are required for this Project to work.

# The Project

This is a Full Stack Project, in which people can create an account and log into it thanks to the authentication. I also added some extra features such as:

## Profile Page:

contains the basic user info like first name, last name etc, and a box where the user can add some extra informations to his profile, for example their Job, Birth Date and so on.
The user can also modify his profile picture by clicking on the default profile picture and uploading a new one.
Also, the logout button, will redirect the user to the login page and they must login again, since the JWT token will be removed.

![exampleprofile](https://github.com/Nicolas-Tietz/FullStackProject/assets/120263952/11ac4122-7778-48c8-83cf-3c59ce94dc25)

## Friends Page

Inside this page, it's possible for users to add other people to their friend list. They just need to search the username in the search bar (could also be first name and/or last name) and click on the Add Friend button to send them a request.

On the top of the page, every user will have their friends showing up, if they have any. Clicking on the X of the Friend Box, will remove him from the friend list.

Also, clicking on the friend's name inside the box, will redirect to the friend's profile.

![friends](https://github.com/Nicolas-Tietz/FullStackProject/assets/120263952/7be204e9-1014-416d-bb5a-994806d3dafb)

![usersearch](https://github.com/Nicolas-Tietz/FullStackProject/assets/120263952/331f9beb-da71-41f6-9f5d-cbe84818ca55)

## Notification Page

This is where user can see their notifications. At the moment, the only one available is the friend request, so here is where you can decide if accepting or declining them.
Notifications will also pop-up for 5 seconds on the top right corner of the screen.

![notification](https://github.com/Nicolas-Tietz/FullStackProject/assets/120263952/051eae33-7473-4bbf-bf0d-16a918a0156d)

### Mobile View

The application has also a mobile layout, where the various elements have been repositioned to fit better into a smaller device.

![mobileview](https://github.com/Nicolas-Tietz/FullStackProject/assets/120263952/fc183eca-e344-46c4-ae1f-3d98b39c1b91)

### Password Encryption

Users password are crypted before being saved inside the database. This has been done with the bcrypt library.

### JWT Token

After logging in, the user will receive a JWT token. This token will allow him to automatically log back into the account without manually logging in. This token expires after a specific amount of time, i set that to 15 minutes as an example.

### User Schema

This is how the user schema looks like. As you can see, the email and the username are the only unique fields, as there cannot be more than one user that has the same username or email.

```
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "",
  },
  friends: {
    type: Array,
    default: [],
  },
  notifications: {
    type: Array,
    default: [],
  },
  additionalInfo: {
    type: Object,
    default: { birthDate: "", city: "", gender: "", job: "", phone: "" },
  },
  pendingRequests: {
    type: Array,
    default: [],
  },
});
```

# How to Download and Install using Git

Create the folder that will contain the Project.
In the terminal, go inside the Project folder.

From there execute:

```
git init
```

```
git pull https://github.com/Nicolas-Tietz/FullStackProject.git
```

Once done, you should have all the necessary files in the folder.

Now, go inside the backend folder, and execute this in the terminal:

```
npm install
```

Do the same thing inside the frontend folder.

Create the .env file **_INSIDE THE BACKEND FOLDER_**, that need to contain these 2 variables:

- MONGO_DB_URL = 'YOUR_MONGODB_URL'
- ACCESS_TOKEN_SECRET='YOUR_ACCESS_TOKEN'

The MONGO_DB_URL is the database connection string that you can find inside your MongoDb database.

While i generated the ACCESS_TOKEN_SECRET like this:

In the terminal inside the frontend or backend folder, execute this:

```
node
```

```
require('crypto').randomBytes(64).toString('hex')
```

You can now copy the result string and paste it inside the ACCESS_TOKEN_SECRET.

### IMPORTANT:

for the user search to work, you must create a search index in the users collection in the database.
To do so,

1. Open your database
2. Go inside the users collection, open the Search Indexes tab and click on Create Search index.
3. Select the JSON editor and change the index name to user_search and keep the code as below:

```
{
  "mappings": {
    "dynamic": true
  }
}
```

4. Proceed to create it.

Now, the project setup is done.

To start the application execute this in both the frontend and backend folder:

```
npm run dev
```

Now, you can try out the application by visiting this link

```
localhost:5173
```
