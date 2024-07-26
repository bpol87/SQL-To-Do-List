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
router.post(`/`, (req, res) => {
    // console.log(`Request in koala /POST made! `, req.body)
    let taskText = req.body.text
    
    // console.log(`koalaTransfer before SQL Query is:`, koalaTransfer)
    let sqlText = `INSERT INTO "todos"
                    ("text")
                    VALUES
                    ($1);`

    let sqlValues = [taskText]
    pool.query(sqlText, sqlValues)
        .then((dbResponse) =>{
            res.sendStatus(201)
        }).catch((dbErr) => {
            console.log(`SQL Query error in todos/POST: `, dbErr)
            res.sendStatus(500)
        })
});

// PUT route
router.put('/:id', (req, res) => {
  console.log(`PUT /todos/:id received a request!`);

  const taskIdToUpdate = req.params.id;
  
  let sqlText = `
    UPDATE "todos"
      SET "isComplete" = 'true'
      WHERE "id" = $1;
  `

  const sqlValues = [taskIdToUpdate];

  pool.query(sqlText, sqlValues)
    .then((dbResult) => {
      res.sendStatus(200);
    })
    .catch((dbError) => {
      console.log('SQL query error in PUT /todos/:id', dbError);
      res.sendStatus(500);
    })
});

//  DELETE route


module.exports = router;
