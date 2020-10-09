const {Router} = require(`express`);
const router = Router();
const Fork = require('../models/Fork');

router.get('/forks', async (req, res)=>{
    console.log('poimal')
    try {
        let arr = await Fork.getForks();
        await sendRes();
        console.log(arr.length)

        async function sendRes(){
            if (arr.length !== 0){
                //
                // res.status(200).json({message: 'Вилок нет'})
                res.send(arr)
            }

            else {
                res.send([])
            }
        }

    }catch (e) {
        res.status(500).json({message: 'Что-то пошло не так. Попробуйте снова'})
    }
})


module.exports = router;