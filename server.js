// importing express package
const express = require('express')
// assigning app to express so we can use it
const app = express()
// internal connection pull we use with MongoDB
const MongoClient = require('mongodb').MongoClient
// assigning port we're using
const PORT = 2121
// package used to allow environment variables in code
require('dotenv').config()

// createing variables for database
let db,
dbConnectionStr = process.env.DB_URI,
    dbName = 'todo-list'

// making sure the database and server are running. 
// having mongo client conncet to database, and logging when connected
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    // assigning view engine as ejs
app.set('view engine', 'ejs')
// connecting to public folder -calling express methods- serve stacic files 
app.use(express.static('public'))
// middleware function- parses incoming requests with URL-encoded payloads and is based on a body parser.
app.use(express.urlencoded({ extended: true }))
// parses incoming requests with JSON
app.use(express.json())

// creates landing page that  
// 
app.get('/api/getTodos', async (request, response) => {
        // Find todos within the collection and turn it into an array
        const todoItems = await db.collection('todos').find().toArray()
        // Respond with JSON data
        response.json({ items: todoItems })

        // Alternatively, if you want to render an EJS view, you can uncomment the following code:
        // response.render('index.ejs', { items: todoItems, left: itemsLeft });
    // } catch (error) {
    //     console.error('Error during /api/getTodos:', error);
    //     response.status(500).json({ error: 'Internal Server Error' });
    // }
});


// '/addTodo' comes from the action on the form

// adding todos
app.post('/api/addTodo', (request, response) => {
    //inserting a todo item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // promise chaining
    .then(result => {
        // letting user know todo was added
        console.log('Todo Added')
        // redirect to landing page
        response.json(result.ops[0])
    })
    //catch errors
    .catch(error => console.error(error))
})

// update and marking complete
app.put('/api/markComplete', (request, response) => {
    //updating completed items - once you check items as done, completed turns from false to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // setting completed as true
        $set: {
            completed: true
          }
    },{
        //sorting from oldest to newest
        sort: {_id: -1},
        // a database operation that will update an existing row if a specified value already exists in a table, and insert a new row if the specified value doesn't already exist
        upsert: false
    })
    // return new promise object
    .then(result => {
        // console log 'Marked Complete'
        console.log('Marked Complete')
        // responding with json
        response.json('Marked Complete')
    })
    //catch errors
    .catch(error => console.error(error))

})

// update on the todos collection 
app.put('/api/markUnComplete', (request, response) => {
    // looking at the todos collection and updating one
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // setting completed to false
        $set: {
            completed: false
          }
    },{
        // sorting from oldest to newest
        sort: {_id: -1},
        // if already in table, it will update. If not, it will make a new row with value. 
        upsert: false
    })
    // return result
    .then(result => {
        // console log 'Marked Complete'
        console.log('Marked Complete')
        // respone with json
        response.json('Marked Complete')
    })
    // catch error
    .catch(error => console.error(error))

})

// sending delete request
app.delete('/api/deleteItem', (request, response) => {
    // delete one from db collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // returning promise obj
    .then(result => {
        //console log 'Todo Deleted'
        console.log('Todo Deleted')
        // respond with json
        response.json('Todo Deleted')
    })
    //catch errors
    .catch(error => console.error(error))

})

// express router listening for env connection || defualt port
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
