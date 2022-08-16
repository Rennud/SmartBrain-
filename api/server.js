import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';


const app = express();

const db = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send(db.users)
})

app.post('/signin', (req, res) => {
/*     bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        // result == true
    }); */
    if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
        res.json(db.users[0]);
    } else {
        res.status(400).json('Error logging in')
    }
    res.json('signing')
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, 10, function(err, hash) {
        console.log(hash)
    });
    db.users.push(
        {
            id: '125',
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
        },
    )
    res.json(db.users[db.users.length - 1])
})

app.get('/profile/:id', (req, res ) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
})