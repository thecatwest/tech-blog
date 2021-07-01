const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "post_content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((usersPostData) => {
      // pass a single post object into the homepage template
      // use res.render() instead of res.send() or res.sendFile() to render homepage.handlebars template
      // second argument is an object which contains all data to pass to the template
      console.log(usersPostData[0]);
      // must serialize the data because res.render() method does not auto serialize data like res.json()
      // loop over and map each Sequelize object into a serialized version, save results in new posts array
      const posts = usersPostData.map((post) =>
        post.get({
          plain: true,
        })
      );
      // add array to an object so it can be passed into res.render() method and be updated with new properties later
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// route to render login/signup page
router.get("/login", (req, res) => {
  // check for session an redirect to homepage if one exists
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/", (req, res) => {
  console.log(req.session);
});

// create new blog post
router.get("/new-post", (req, res) => {
  if (req.session.loggedIn) {
    res.sender("new-post");
  } else {
    res.render("login");
  }
});

// get individual blog post

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "post-content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((usersPostData) => {
      if (!usersPostData) {
        res.status(404).json({
          message: "No post found with that id",
        });
        return;
      }

      // serialize the data
      const usersData = usersPostData.get({
        plain: true,
      });

      const loggedIn = req.session.loggedIn;
      if (req.session.loggedIn) {
        // pass data to template
        res.render("single-post", {
          usersData,
          loggedIn,
        });
      } else res.render("login");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  // update blog post content
  router.get(
    "/posts/edit/:id",
    (req,
    (res) => {
      Post.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Comment,
            attributes: [
              "id",
              "comment_text",
              "post_id",
              "user_id",
              "created_at",
            ],
            include: {
              model: User,
              attributes: ["username"],
            },
          },
          {
            model: User,
            attributes: ["username"],
          },
        ],
      })
        .then((usersPostData) => {
          if (!usersPostData) {
            res.status(404).json({ message: "No post found with that id." });
            return;
          }

          const usersData = usersPostData.get({
            plain: true,
          });

          res.render("edit-blog", usersData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
  );
});

module.exports = router;
