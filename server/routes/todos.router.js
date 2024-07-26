const router = require('express').Router();
const pool = require('../modules/pool.js');

// GET route
router.get('/', (req, res) => {
    let queryText = `
            SELECT * FROM "todos"
                ORDER BY "id";
    `;
    
    pool.query(queryText).then(result => {
      // Sends back the results in an object
      res.send(result.rows);
    })
      .catch(error => {
        console.log('error getting tasks', error);
        res.sendStatus(500);
      });
  });
// POST route

// PUT route

//  DELETE route


module.exports = router;
