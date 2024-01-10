const connection = require('../db.js');
const {nanoid} = require('nanoid');
const shortUniqueId = require('short-unique-id');
const {mapUser,mapKey} = require('../service/service.js')
const crypto = require('crypto')

async function loginUser(req,res){
    const body = req?.body;

    if(!body)return res.render('login',{message : "body cannot be empty"});

    const name = body?.name;
    const password = body?.password;
    if((!name) || (!password))return res.render('login',{message : "name or password cannot be empty"});

    const qury = `select user_id from carUsers where username = ? and password = ?`;
    const values = [name,password];
    await connection.query(qury, values, async (err, result) => {
        if (err) {
            return res.status(501).json({ error: err });
        }
    
        if (result.length === 0) {
            return res.render('login', { message: 'name or password is wrong' });
        }
    
        user_id = result[0].user_id;
        const token = await mapUser({name : name,user_id : user_id});
        await res.cookie('token',token);
        return res.redirect('/user');  
    });
    
}
async function createUser(req,res){
    const body = req?.body;
    console.log('in login user',req.body);
    if(!body)return res.render('signup',{message : "body cannot be empty"});

    const name = body?.name;
    const password = body?.password;
    if((!name) || (!password))return res.render('signup',{message : "name or password cannot be empty"});
    const qury1 = `select COUNT(*) as count from carUsers where username = ?`;
    const value = [name];
    await connection.query(qury1,value,async(err,result)=>{
        const count = result[0].count;
        console.log('res length ',count);
        if(err)return res.json({error: err});
        else if(count > 0){
            return res.render('signup',{message : 'Username not available use a different username'});
        }
        else{
            const qury = `insert into carUsers values(?,?,?)`;
            const user_id = nanoid();
            const values = [name,password,user_id];
            await connection.query(qury,values,(err,result)=>{
                if(err){
                    return res.json({error : err});
                }
                else{
                    return res.render('login');
                }
            })
        }
    })
}
module.exports = {loginUser,createUser};