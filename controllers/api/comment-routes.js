const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all post comments
router.get('/', (req, res) => {
    Comment.findAll({
         attributes: [
              'comment_text',
              'post_id',
              'user_id'
         ]
    })
    .then(dbCommentData => {
         if (!dbCommentData) {
              res.status(404).json({ message: 'No comments found!' });
              return;
         }
         res.json(dbCommentData);
    })
    .catch(err => {
         console.log(err);
         res.status(500).json(err);
    })
});

// create (post) new comment
router.post('/', withAuth, (req, res) => {
  // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id
  })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'No comment found with that id!' });
        return;
      }
      res.json(dbCommentData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
