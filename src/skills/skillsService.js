const xss = require('xss');

const skillsService = {
    
    getAllSkills(db){
        return db
            .select('*')
            .from('skills')
            .join('users', 'skill.owner_id', '=', 'users.id')
            .where();
    },
  
    getSkillsByUserId(db, id){
        return db ('skills')
            .join('users', 'skills.owner_id', '=', 'users.id')
            .select('skills.id', 'title', 'time_left')
            .where('skills.owner_id', id);
    },

    getSkillBySkillId(db,skills_id){
        return db('skills')
            .select('*')
            .join('users', 'skills.owner_id', '=', 'users.id')
            .where('skills.id', skills_id)
            .first();
    },

    insertSkill(db,newSkill){
        return db
            .insert(newSkill)
            .into('skills')
            .returning('*')
            .then(rows => rows[0]);
    },

    updateSkill(db,id,skillUpdateFields){
        return db('skills')
        .update(skillUpdateFields)
        .where({id});
    },

    deleteSkill(db,id){
        return db('skills')
        .delete()
        .where({id});
    },

    serializeSkill(skills){
        return {
        id: skills.id,
        title: xss(skills.title),
        time_left: xss(skills.time_left),
        };
    },
};

module.exports = skillsService;