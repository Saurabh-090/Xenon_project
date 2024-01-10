const express = require('express');
const controller = require('../controllers/controller');
const checkAuthorisedUser = require('../middlewares/middleware');
const {mapKey} = require('../service/service.js')
const connection = require('../db.js')

const router = express.Router();

router.get('/login',(req,res)=>{res.render('login')});

router.get('/signup',(req,res)=>{res.render('signup')});

router.post('/login',controller.loginUser);
router.post('/signup',controller.createUser);

router.get('/user',checkAuthorisedUser,async(req,res)=>{
    const token = req.cookies.token || req.headers || req.query.token;
    
    const val = mapKey(token);

    if(val == null)res.redirect('/login');

    const {name,user_id} = val;
    await connection.query('select * from cars',(err,result)=>{
        if(err)console.log(err);
        else{
            console.log("cars ",result);
            res.render('home',{name:name,cars:result});
        }
    })
    
})

router.get('/buy/:id', (req, res) => {
    const carId = req.params.id;
  
    
    connection.query('SELECT * FROM cars WHERE id = ?', [carId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (results.length === 0) {
       
        res.status(404).send('Car not found');
      } else {
        console.log(results[0]);
        res.render('buy', { car: results[0] });
      }
    });
  });
  
  // ...
  
module.exports = router;

