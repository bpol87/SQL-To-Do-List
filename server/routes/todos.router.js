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
    .then((dbResponse) => {
      res.sendStatus(201)
    }).catch((dbErr) => {
      console.log(`SQL Query error in todos/POST: `, dbErr)
      res.sendStatus(500)
    })
});

// PUT route
router.put('/:id', (req, res) => {

  const taskIdToUpdate = req.params.id;

  let sqlText = `
    UPDATE "todos"
      SET "isComplete" = $1, "completedAt" = $2
      WHERE "id" = $3;
  `

  const sqlValues = [req.body.isComplete, req.body.completedAt, taskIdToUpdate];
  console.log(sqlValues);
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
router.delete('/:id', (req, res) => {
  //
  const sqlQuery = `
  DELETE FROM "todos"
    WHERE "id" = $1;`

  //Magic Spell to get paramater
  const sqlValues = [req.params.id]
  pool.query(sqlQuery, sqlValues)
    .then((dbResponse) => {
      res.sendStatus(200)
    }).catch((dbErr) => {
      console.log(`SQL query error in DELETE /todos/:id: `, dbErr)
      res.sendStatus(500)
    })

});

// PATCH route
router.patch(`/:id`, (req, res) => {
  const sqlText = `
  UPDATE "todos"
    SET "text" = $1 WHERE "id" = $2;`

  const sqlValues = [req.body.newTaskText, req.params.id]
  pool.query(sqlText, sqlValues)
    .then((response) => {
      res.sendStatus(200)
    }).catch((dbErr) => {
      console.log(`SQL Query error in koalas/PATCH: `, dbErr)
      res.sendStatus(500)
    })
})

module.exports = router;
