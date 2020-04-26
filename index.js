const e=require('express')
const app=new e();
const path=require('path')
app.use(require('cors')())
app.use(require('body-parser').urlencoded({extended:true}))
app.use(require('./login'))

const h=require('http').createServer(app)
const io=require('socket.io')(h)
const m=require('mongodb')
const jwt=require('jsonwebtoken')

const PORT=process.env.PORT || 5000
const url=process.env.mongodb

/*
mongodb server contains a database with name 'superchat' having 2 collections 
'messages' and 'users'
*/


app.use(e.static(path.join(__dirname,'react_build')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'react_build','index.html'))
})



const SECRET_KEY='random_secret'

let messages;



m.connect(url,(err,re)=>{
    if(err){
        console.log('cannot connect to db')
        throw err
    }
    
    messages=re.db('superchat').collection('messages')
        
})


io.on('connect',(socket)=>{
    //console.log(socket)
    socket.on('join',(data)=>{
        console.log('came here',data.name)
        socket.join(data.name)
    })
})


app.post('/send',(req,res)=>{
    req.body.dta.time=parseInt(req.body.dta.time.toString())
    console.log(req.body.dta)

    jwt.verify(req.body.token,SECRET_KEY,(err,u)=>{
        if(u && u.name==req.body.dta.from){
            io.in(req.body.dta.to).emit('msg',req.body.dta)
            messages.insertOne(req.body.dta,(err,re)=>{

                if(!err)
                     return res.send({'success':true})
                else{
                    console.log(err)
                    return res.send({'success':false})
                   
                }
                    
            })


        }else{
            console.log('unverifired')
            return res.send({'error':'unverified'})
        }
    })

})




app.post('/fetch',(req,res)=>{

    jwt.verify(req.body.token,SECRET_KEY,(err,u)=>{
        if(u){

            messages.find({$or:[{'from':u.name},{'to':u.name}]},(err,re)=>{
                if(err)
                    return res.send({'error':'server error'})
                else
                    re.sort({'time':1}).toArray((err,d)=>{
                        if(d){
                        //console.log(d)
                        return res.send(d)
                        }
                        else
                        return res.send([])
                    })
                    
            })

        }else
            return res.send({'error':'invalid user'})
    })

})

h.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})