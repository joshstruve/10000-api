const express = require('express');
const skillsService = require('./skillsService');
const skillsRouter = express.Router();
const requireAuth = require('../middleware/jwt-auth');

// need multiple routers - include skill id for patch & delete only

skillsRouter
    .route('/')
    .all(requireAuth)

    //GET
    .get((req,res,next) => {
        const owner_id = req.user.id;

        return skillsService.getSkillsByUserId(req.app.get('db'),owner_id)
        .then(skills => {
            const cleanedSkills = skills.map(skill => skillsService.serializeSkill(skill));
            return res.json(cleanedSkills);
        })
        .catch(next);
    })

    //POST
    .post(express.json(), (req,res,next) => {
        const {title} = req.body || ''
        const owner_id = req.user.id;
        
        if(!title){    
            return res.status(400).json({error: 'Please add a skill title'});
        }

        let newSkill = {title, time_left: 36000000000, owner_id};

        return skillsService.insertSkill(req.app.get('db'),newSkill)
        .then(skill => {
            skill.user_name = newSkill.owner_id;
            return res.status(201).json(skillsService.serializeSkill(skill));
        })
        .catch(next);
    })


skillsRouter
.route('/:skillsId')
.all(requireAuth)
  
    //PATCH
    .patch(express.json(), (req,res,next) => {
        console.log('here')
        const {skillsId} = req.params;
        const {time_left} = req.body;
    
        const skillUpdateFields = {
            time_left:parseInt(time_left),
        };
        
        if(skillUpdateFields.time_left == null){    
            return res.status(400).json({error: 'Needs at least one update field'});
          }
      
          skillsService.getSkillBySkillId(req.app.get('db'),skillsId)
            .then(skill => {
                if(!skill)
                return res.status(400).json({error: 'Could not find skill'});    
                
              if(skill.owner_id !== req.user.id)
                return res.status(401).json({error: 'Unauthorized request'});
      
              skillsService.updateSkill(req.app.get('db'),skillsId,skillUpdateFields)
                .then(() => {
                  return res.status(204).end();
                })
                .catch(next);
            })
            .catch(next);
    })

    //DELETE
    .delete(express.json(), (req,res,next) => {

    const {skillsId} = req.params;
    skillsService.getSkillBySkillId(req.app.get('db'),skillsId)
      .then(skill => {

        if(!skill)
          return res.status(400).json({error: 'Could not find this skill'});      

            return skillsService.deleteSkill(req.app.get('db'),skillsId)
            .then(() => res.status(204).end())
            .catch(next);
      })        
      .catch(next);
    });


module.exports = skillsRouter;