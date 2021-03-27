const express =require('express');
const mongoose =require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');
const Student=require('./models/Students')

const app=express();

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/students');
mongoose.connection.on('connected',()=>{
    console.log('connected database')
})
mongoose.connection.on('error',()=>{
    console.log('error occured');
})
app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
    Student.find()
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).send(result);
    })
    .catch(err=>{
        res.status(500).send(err)
    })
})
app.post('/students',(req,res)=>{
    
    const student=new Student({
        _id:new mongoose.Types.ObjectId,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        place:req.body.place
    })
    student.save()
    .then(result=>{
        console.log(result);
        res.status(200).json({msg:"sucessfully submitted"})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({msg:"Error occured"})
    })
    
})

app.delete('/student/:id',(req,res)=>{
    const id=req.params.id;
    Student.remove({_id:id},(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("error occured")
        }
        else{
            res.status(200).json({msg:"Sucessfully deleted"})
        }
    })
})
app.put('/student/:id',(req,res)=>{
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const place=req.body.place;
    const id=req.params.id;
    Student.update({_id:id},{$set:{firstname:firstname,lastname:lastname,place:place}})
    .then(result=>{
        console.log(result);
        res.status(200).json({msg:"Sucessfully updated"})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({msg:"Error occured"})
    })
})
app.listen(5000,()=>{
    console.log('Server is connected on port 5000');
})