import express from "express";
import { User } from "../models/userModel.js";
import { Login } from "../models/loginModel.js";
import bcrypt from "bcrypt";
import upload from "../multerConfig.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
//Register Route
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.firstName || !req.body.lastName) {
      return res.status(400).send({
        message: "Required fields are: email,password,firstName and lastName",
      });
    }

    const firstNameWords = req.body.firstName.split(" ");

    const capitalizedFirstName = firstNameWords.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    const firstName = capitalizedFirstName.join(" ");

    const lastNameWords = req.body.lastName.split(" ");

    const capitalizedLastName = lastNameWords.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    const lastName = capitalizedLastName.join(" ");

    const newUser = {
      email: req.body.email,
      firstName: firstName,
      lastName: lastName,
      username: req.body.username,
    };

    const newLogin = {
      email: req.body.email,
      password: req.body.password,
    };

    const existsEmail = await Login.findOne({ email: req.body.email });
    if (existsEmail) return res.status(409).send();
    const existsUsername = await User.findOne({ username: req.body.username });
    if (existsUsername) return res.status(409).send();

    const login = await Login.create(newLogin);

    const user = await User.create(newUser);

    return res.status(201).send(user);
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    }
    return res.status(500).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Login req.body", req.body);

    if (!req.body.email || !req.body.password)
      return res.status(400).send("Must contain Email and password");

    const userLogin = await Login.findOne({ email: req.body.email });
    if (!userLogin) return res.status(404).send("User doesnt exist");

    const isValid = await bcrypt.compare(req.body.password, userLogin.password);
    if (!isValid) {
      return res.status(401).send("Wrong Password");
    }
    const obj = { email: req.body.email };
    const accessToken = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);
    console.log("AccessToken", accessToken);
    res.cookie("token", accessToken, {
      expires: new Date(Date.now() + 900000),
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    const user = await User.findOne({ email: req.body.email });

    return res.status(200).send();
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

router.get("/logout", removeToken, (req, res) => {
  res.status(200).send("Logout");
});

router.get("/search", async (req, res) => {
  const searchQuery = req.query.query;

  const pipeline = [];
  pipeline.push({
    $search: {
      index: "user_search",
      text: {
        query: searchQuery,
        path: ["firstName", "lastName", "username"],
        fuzzy: {},
      },
    },
  });
  pipeline.push({
    $project: {
      _id: 0,
      score: { $meta: "searchScore" },
      firstName: 1,
      lastName: 1,
      username: 1,
      image: 1,
      email: 1,
    },
  });

  const result = await User.aggregate(pipeline).sort({ score: -1 }).limit(10);
  return res.json(result);
  /*const searchQuery = req.query.query;
  const result = await User.find(
    {
      $text: {
        $search: searchQuery,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    },
    { score: { $meta: "textScore" }, _id: 0 }
  )

    .sort({ score: { $meta: "textScore" } })
    .limit(10);*/
});

router.get("/dashboard-info", authenticateToken, async (req, res) => {
  const email = req.user.email;
  const user = await User.findOne({ email: email });

  return res.status(200).send(user);
});

router.get("/get-image:email", async (req, res) => {
  try {
    //prendere email da body
    const { email } = req.params;

    const user = await User.findOne({ email: email });
    return res.status(200).send(user.image);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//PROVARE A TRASFORMARE DA BUFFER A IMMAGINE DA QUI NEL SERVER VISTO CHE CLIENT SIDE SEMBRA NON SI POSSA FARE PIù DI BASE

router.post("/upload-image", upload.single("file"), async (req, res) => {
  const { base64, email } = req.body;

  try {
    const result = await User.updateOne({ email: email }, { image: base64 });

    return res.status(200).send();
  } catch (error) {
    return res.send({ Status: "error", data: error });
  }
});

//Update User, da fare meglio per evitare che se voglio cambiare email debba anche scrivere tutto il resto (un po come ho fatto con nodejs restful)
//Patch è per quando vogliamo modificare solo qualche dato e non tutto, mentre con put andiamo ad aggiornare tutto il documento. Quindi nel mio caso sarà meglio
//fare patch
router.patch("/:id", async (req, res) => {
  try {
    const toUpdate = {};

    if (Object.keys(req.body).length === 0)
      return res.status(400).send("Body cant be empty");

    const userInfos = ["firstName", "lastName", "email"];

    for (const elem in req.body) {
      if (!userInfos.includes(elem)) {
        return res.status(400).send(
          `There is no field called ${elem}.<br/>
               Fields are: firstName, lastName and email`
        );
      }
    }

    if (req.body.firstName) toUpdate.firstName = req.body.firstName;
    if (req.body.lastName) toUpdate.lastName = req.body.lastName;
    if (req.body.email) toUpdate.email = req.body.email;
    const { id } = req.params;
    const result = await User.findByIdAndUpdate(id, { $set: toUpdate });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send({ message: "User updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "User not found" });

    return res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

router.get("/auth-check", authenticateToken, (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json(req.user);
    }
    return res.status(401).send("User NOT authenticated");
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-friend", async (req, res) => {
  try {
    const { senderUser, receiverUser } = req.body;

    const notificationObj = {
      type: "Friend Request",
      sender: senderUser.email,
      date: Date.now(),
    };

    const senderUserDoc = await User.updateOne(
      {
        email: senderUser.email,
      },
      { $push: { pendingRequests: receiverUser.email } }
    );

    //Add the sent request in the sender document

    //Add notification to the receiver document
    const result = await User.updateOne(
      { email: receiverUser.email },
      {
        $push: {
          notifications: notificationObj,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error adding friend usersroute", error);
  }
});

router.post("/remove-friend", async (req, res) => {
  try {
    const { user, friend } = req.body;

    const userUpdate = await User.updateOne(
      {
        email: user.email,
      },
      { $pull: { friends: { email: friend.email } } }
    );
    const friendUpdate = await User.updateOne(
      {
        email: friend.email,
      },
      { $pull: { friends: { email: user.email } } }
    );
    return res.status(200).json({ message: "Friend Removed Successfully" });
  } catch (error) {
    console.error("Error adding friend usersroute", error);
  }
});

router.post("/accept-request", async (req, res) => {
  try {
    const { senderUser, receiverUser } = req.body;

    //Aggiungere ad entrambi
    const senderUpdate = await User.findOneAndUpdate(
      { email: senderUser },
      {
        $push: { friends: { email: receiverUser, date: Date.now() } },
        $pull: { pendingRequests: receiverUser },
      },
      { new: true }
    );
    const receiverUpdate = await User.findOneAndUpdate(
      { email: receiverUser },
      {
        $push: { friends: { email: senderUser, date: Date.now() } },
        $pull: {
          notifications: { type: "Friend Request", sender: senderUser },
        },
      },
      { new: true }
    );

    return res.status(200).send("Groda");
  } catch (error) {
    console.error(error);
  }
});
router.post("/decline-request", async (req, res) => {
  try {
    const { senderUser, receiverUser } = req.body;

    //Rimuovere da pendingRequests del sender
    //Rimuovere da notifiche del receiver
    const sender = await User.findOneAndUpdate(
      { email: senderUser },
      { $pull: { pendingRequests: receiverUser } }
    );
    const receiver = await User.findOneAndUpdate(
      { email: receiverUser },
      {
        $pull: {
          notifications: { type: "Friend Request", sender: senderUser },
        },
      }
    );

    return res.status(200).send("Groda");
  } catch (error) {
    console.error(error);
  }
});

router.post("/additional-info", async (req, res) => {
  try {
    const { formData, email } = req.body;

    const updateFields = {};
    //loops over datas, inserting into updateFields the fields found inside,
    //in the format needed for mongodb to update only those specific fields
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        updateFields[`additionalInfo.${key}`] = formData[key];
      }
    }

    const result = await User.findOneAndUpdate(
      { email: email },
      { $set: updateFields }
    );

    return res.status(200).send();
  } catch (error) {
    console.error(error);
  }
});

router.post("/fetch-friends-info", async (req, res) => {
  try {
    const friends = req.body;

    const friendsArr = [];
    for (let friend of friends) {
      const fetchedFriend = await User.findOne(
        { email: friend.email },
        { _id: 0 }
      );
      friendsArr.push(fetchedFriend);
    }
    return res.status(200).send(friendsArr);
  } catch (error) {
    console.error(error);
  }
});

function authenticateToken(req, res, next) {
  try {
    const authToken = req.cookies.token;
    console.log("Cookies:", req.cookies);
    if (authToken == null) return res.status(401).send("Token Null");
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send();
      req.user = user;

      next();
    });
  } catch (err) {
    console.log(err);
  }
}

function removeToken(req, res, next) {
  res.clearCookie("token");
  res.status(200).send("Cookie cleared");
}

export default router;
