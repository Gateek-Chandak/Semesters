const express = require('express')
const supabase = require('../supabase/supabaseClient')

const router = express.Router()

// GET ALL Splits
router.post('/getSplits', async (req, res) => {
    const user_id = req.body.userID

    try {
        let { data } = await supabase
            .from('Workout_Splits')
            .select('*')
            .eq('user_id', user_id);
        const response = data
        res.status(200).json({response})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
})

// POST A Split
router.post('/addSplits', async (req, res) => {
    const split = req.body
    try {
        const { data } = await supabase
                        .from('Workout_Splits')
                        .insert([{ split_name: split.split_name,
                                   items: split.items,
                                   email: split.email,
                                   user_id: split.user_id},])
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
    
})

// DELETE A Split
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    const user_id = req.body.user_id

    try {
        const { data, error } = await supabase
            .from('Workout_Splits')
            .delete()
            .eq('id', id)
            .eq('user_id', user_id)
        if(error)  {
            throw new Error('error deleting split')
        }
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
    

})

// GET SPECIFIC Split
router.post('/getSplit', async (req, res) => {
    const user_id = req.body.user_id
    const split_name = req.body.name
    try {
        let { data } = await supabase
            .from('Workout_Splits')
            .select('*')
            .eq('split_name', split_name)
            .eq('user_id', user_id)
        const response = await data
        res.status(200).json({response})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
})



module.exports = router