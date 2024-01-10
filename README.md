Rembemer to add the part to create the index for the search




While in the backend execute these commands to generate the ACCESS_TOKEN_SECRET:

node

Once inside node, write this:

require('crypto').randomBytes(64).toString('hex')

This line generates a string made of 64 random bytes that we'll use as ACCESS_TOKEN_SECRET.
