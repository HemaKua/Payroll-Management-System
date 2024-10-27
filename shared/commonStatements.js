// exports. missingFieldsError=(res, fields)=> {
//     return res.status(400).json({ error: `Missing required fields: ${fields.join(', ')}` });
// }

module.exports={
    missingFieldsError:async(res, fields)=>{
        return res.status(400).json({ error: `Missing required fields: ${fields.join(', ')}` });
    },
    userNotFoundError:(res, message)=> {
        return res.status(404).json({ error: message && "User not found" });
    },



}