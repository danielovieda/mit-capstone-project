const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 1337;
const {
  createUser,
  login,
  logout,
  createTransaction,
  deleteUser,
  getTransactions,
} = require("./mongo.js");
const jwt = require("jsonwebtoken");
const secret = "bad-bank";

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
var jsonParser = bodyParser.json();
app.use(jsonParser);

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign({ email, password }, secret);
  await login(email, password)
    .then((data) => {
      if (data.email) {
        return res.status(200).send({ ...data, token });
      } else if (data.error === 'Wrong password.') {
        return res.status(401).send({message: 'Wrong password.'})
      } else if (data.error === 'Email does not exist.') {
        return res.status(401).send({message: 'User does not exist.'})
      }
    })
    .catch((e) => {
      console.log(e);
      res.send(500).send(e);
    });
});

app.post("/logout", async (req, res) => {
  const { email } = req.body;
  await logout(email)
    .then((data) => {})
    .catch((e) => {
      console.log(e);
      res.send(500).send(e);
    });
});

app.post("/withdrawal", auth, async (req, res) => {
  const { email, amount } = req.body;
  await createTransaction(email, "withdrawal", amount)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      console.log(e);
      res.send(500).send(e);
    });
});

app.post("/deposit", auth, async (req, res) => {
  const { email, amount } = req.body;
  await createTransaction(email, "deposit", amount)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});

app.post("/user/create", async (req, res) => {
  console.log("create user called", req.body);
  const { name, email, password } = req.body;
  await createUser(name, email, password)
    .then((data) => {
      if (data) {
        delete data.password;
        res.status(200).send(data);
      } else {
        res.status(500).send({ message: "User not created." });
      }
    })
    .catch((e) => {
      console.log(e);
      res.send(500).send(e);
    });
});

app.post("/user/transactions", auth, async (req, res) => {
  const { email } = req.body;
  await getTransactions(email)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});

app.delete("/user/delete", auth, async (req, res) => {
  const { email } = req.body;
  await deleteUser(email)
    .then((data) => {
      if (data) {
        res.status(200).send({ message: "Success!" });
      } else {
        res.status(400).send({ message: "Wrong password." });
      }
    })
    .catch((e) => {
      console.log(e);
      res.send(500).send(e);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
