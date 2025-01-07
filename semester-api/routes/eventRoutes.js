const express = require('express')
const supabase = require('../supabase/supabaseClient')

const router = express.Router()

// GET events
router.post('/getEvents', async (req, res) => {
    const user_id = req.body.userID

    try {
        let { data } = await supabase
            .from('Workout_Events')
            .select('*')
            .eq('user_id', user_id);
        const response = data
        //console.log(data)
        res.status(200).json({response})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
})

// UPDATE events
router.post('/updateEvents', async (req, res) => {
    const events = req.body.events
    const user_id = req.body.userID
    try {   
        const { data } = await supabase
            .from('Workout_Events')
            .update({ events:  events})
            .eq('user_id', user_id)
            .select()

        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
    
})

// CREATE events 
router.post('/createEvents', async (req, res) => {
    const events = req.body.events
    const user_id = req.body.userID
    console.log(req.body)
    try {   
        
        const { data, error } = await supabase
                .from('Workout_Events')
                .insert([
                { events: [], user_id: user_id },
                ])
                .select()
        console.log(data)
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
    }
    
})

module.exports = router