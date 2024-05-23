const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email, // Corrected this line
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit) // Call trx.commit() as a function
        .catch(trx.rollback); // Call trx.rollback() as a function
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Unable to register user' });
    });
}

module.exports = {
    handleRegister: handleRegister
}