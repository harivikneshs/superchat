const app=require('express').Router()
const m=require('mongodb')
const b=require('body-parser')
const jwt=require('jsonwebtoken')

app.use(b.urlencoded({extended:false}))
app.use(b.json())
app.use(require('cors')())


const url=process.env.mongodb
const SECRET_KEY='random_secret'

let users;
m.connect(url,(err,re)=>{
    if(err){
        console.log('error connecting to db')
        throw err
    }
    else
        users=re.db('superchat').collection('users')
    
})



app.post('/login',(req,res)=>{
    console.log(req.body)
    if(!users) 
        return res.send({'error':'server error'})
    
    users.findOne({'name':req.body.name,'pwd':req.body.pwd},(err,r1)=>{
        if(err)
            return res.send({'error':'server error'})
        if(!r1)
            return res.send({'error':'Invalid credentials'})
        
    
        const tok=jwt.sign({'id':r1._id,'name':r1.name},SECRET_KEY)
        return res.send({'token':tok})

    })  
    
})




app.post('/signup',(req,res)=>{
        if(!users)
            return res.send({'error':'server error'})
     
        users.findOne({name:req.body.name},(err,r1)=>{
            if(err)
                return res.send({'error':'server error'})
            if(r1)
                res.send({'error':'User already exists'})
            else{
                users.insertOne({name:req.body.name,pwd:req.body.pwd},(err,r2)=>{
                    if(!err){
                        console.log(r2.ops) 
                        const tok=jwt.sign({'id':r2.ops[0]._id,'name':r2.ops[0].name},SECRET_KEY)
                        return res.send({'token':tok})
                    
                    }
                    else
                        res.send({'error':'Error creating account. Try again'})
                })
            }
            
        })      

})




app.post('/check',(req,res)=>{
    console.log(req.body.token)
    jwt.verify(req.body.token,SECRET_KEY,(err,s)=>{
        console.log(s)
        if(s){
            s.verified=true
            return res.send(s)
        }else
            return res.send({'verified':false})
        
    })
  
})

app.post('/usr',(req,res)=>{
    users.findOne({'name':req.body.usr},(err,r)=>{
        if(r)
            return res.send(true)
        else
            return res.send(false)
    })
})




module.exports=app