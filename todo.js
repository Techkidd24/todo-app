const express=require('express');
const jwt=require('jsonwebtoken');
const secretKey='mummystealer69';
const app=express();
const path=require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todo=[];
let users=[];

function authenticator(req,res,next){
    const token=req.headers.token;
    const decodedData=jwt.verify(token,secretKey);
    if(decodedData.username){
        req.username=decodedData.username;
        next();
    }
    else{
        res.json({
            message: "invalid credentials"
        })
    }

}

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html")
})

app.post('/signIn',function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    let foundUser=null;

    for(let i=0; i<users.length; i++){
        if(users[i].username==username && users[i].password==password){
            foundUser=users[i];
        }
    }

    if(foundUser){
        const token=jwt.sign({
            username: foundUser.username
        },secretKey);

        res.json({
            token: token,
            message: "You have successfully signed in!"
        })
    }else{
        res.status(403).json({
            message: "Invalid username or password"
        })
    }
})

app.post('/signUp',function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    users.push({
        username: username,
        password: password
    })
    return res.sendStatus(200);
    // res.status(200).json({message: "success"});
})

app.post('/create',authenticator,function(req,res){
    // const id=req.body.id;
    const title=req.body.title;
    const id=todo.length ? todo[todo.length-1].id+1 : 1; 
    const currentUser=req.username;
    //When there are existing todos: It creates a new ID by taking the last todo's ID and adding 1 to it.

    todo.push({
        id: id,
        username: currentUser,
        title
    });
    res.send('todo added')
})

app.get('/todos',authenticator,function(req,res){
    const currentUser=req.username;
    const userTodos=todo.filter((user)=>user.username===currentUser);
    res.json(userTodos);
})

app.put('/update/:id',authenticator,function(req,res){
    const id=parseInt(req.params.id);
    const title=req.body.title;
    
    for(let i=0; i<todo.length; i++){
        if(todo[i].id==id){
            todo[i].title=title;
        }
    }
    res.send(`todo updated with id ${id}`);
})

app.delete('/delete/:id', authenticator,function(req,res){
    const id=parseInt(req.params.id);
    const index=todo.findIndex(todo=>todo.id===id);
    todo.splice(index,1);
    res.send("todo deleted");
})

app.listen(3000);