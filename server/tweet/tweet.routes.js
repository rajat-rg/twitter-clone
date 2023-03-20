const router = require('express').Router()
const fetchUser = require('../utils/fetchUser')
router.get('/',fetchUser,(req,res)=>{
    console.log(req.user)
    res.send('tweet tweet')
})
module.exports = router

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxODNhMWNmNTRhMGY5MjdlNmRlODdmIn0sImlhdCI6MTY3OTMwOTU0Mn0.Fp99H-gBZ5fbvXm1oJ4pBGJPKE0kUv89prUGIdqSr-k