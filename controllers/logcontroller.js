const express = require("express");
const router = express.Router();
const { Log } = require("../models");
// const logModel = require("..models/log");
const validateSession = require("../middleware/validate-jwt");

router.post("/", validateSession, async (req, res) => {
    let {description, definition, result} = req.body.log;

    try {
        const newLog = await Log.create({
            description,
            definition,
            result,
            owner_id: req.user.id
        });
        res.status(201).json({
            log: newLog,
            message: "Log has been created!"
        })
    } catch (error) {
        res.status(500).json({
        message: `Failed to create log: ${error}`
    })  
    }
});

router.get("/", validateSession, async (req, res) => {
    try {
        const allLogs = await Log.findAll({
            where: { owner_id: req.user.id },
        }); 
        res.status(200).json(
            {allLogs}
        );
    } catch (error) {
        res.status(500).json({
        error: `You have an error: ${error}`
    });
    }
});

router.get("/:id", validateSession, async (req, res) => {
    try {
        const allLogs = await Log.findAll({
            where: { owner_id: req.user.id },
        }); 
        res.status(200).json(
            {allLogs}
        );
    } catch (error) {
        res.status(500).json({
        error: `You have an error: ${error}`
    });
    }
});

router.delete("/:id", validateSession, async (req, res) => {
    // router.delete("/delete/:id", async (req, res) => {
    // const logId = req.params.id;
    // await Log.destroy({where: {id: logId}})
    const logToDelete = req.user.id;
    try {
    
        let log = await Log.findOne({ 
        where: { 
        owner_id: req.user.id
        }
        });

        if (Log) {
        const query = {
            where: {
            owner_id: req.user.id
            },
        };
    
        await Log.destroy(query);
    
        res.status(200).json({
            message: `This log has been deleted`,
        });
        } else {
        res.status(200).json({
            message: "Log not found"
            })
        }
    
    } catch (error) {
        res.status(500).json({
        message: `There was an issue deleting this log: ${error}`,
        error,
        });
    }
    });

router.put("/:id", validateSession, async (req, res) => {
    const {description, definition, result} = req.body.log;

    const query = {
    where: {
    owner_id: req.user.id
    }
}

const updatedLog = {
        description: description,
        definition: definition,
        result: result
    }

try {
    const update = await Log.update(updatedLog, query);
    res.status(200).json({
    message: "Log changed!",
    update
    })
    } catch (error) {
    res.status(500).json({
        message: `Something Went Wrong!`
    })
}
});

module.exports = router;