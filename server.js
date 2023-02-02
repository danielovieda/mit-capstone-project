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
  updateUser
} = require("./mongo.js");
const dayjs = require("dayjs");

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
var jsonParser = bodyParser.json();
app.use(jsonParser);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await login(email, password)
    .then((data) => {
        if (data) {
            return res.status(200).send({message: 'Success!'})
        } else {
            return res.status(400).send({message: 'Wrong password.'})
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

app.post("/withdrawal", async (req, res) => {
  const { amount } = req.body;
  await createTransaction("withdrawal", amount, dayjs())
    .then((data) => {})
    .catch((e) => {
        console.log(e);
        res.send(500).send(e);
    });
});

app.post("/deposit", async (req, res) => {
  const { amount } = req.body;
  await createTransaction("deposit", amount, dayjs())
    .then((data) => {})
    .catch((e) => {
        console.log(e);
        res.send(500).send(e);
    });
});

// app.get('/user', (req,res) => {
//     //get user details
//     const {email}
// })

app.post("/user/create", async (req, res) => {
  const { name, email, password } = req.body;
  await createUser(name, email, password)
    .then((data) => {
      if (data) {
        res.status(200).send({message: 'Success!'});
      } else {
        res.status(500).send({message: 'User not created.'})
      }
    })
    .catch((e) => {
      console.log(e);
      res.send(500).send(e);
    });
});

app.post("/user/update", async (req, res) => {
    const { name, email, password } = req.body;
    await updateUser(name, email, password)
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch((e) => {
        console.log(e);
        res.send(500).send(e);
      });
  });

app.delete("/user/delete", async (req, res) => {
    const {email, password} = req.body;
    await deleteUser(email, password).then((data) => {
        if (data) {
            res.status(200).send({message: 'Success!'})
        } else {
            res.status(400).send({message: 'Wrong password.'})
        }
    }).catch((e) => {
        console.log(e);
      res.send(500).send(e);
    })
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
