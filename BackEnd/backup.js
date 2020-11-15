const session = require("./../model/session_model");
const showRes = require("./../utils/showRes");
const file =require("./../model/file_model");
exports.createNewSession = async(req,res)=>{
    const fsession = await session.create(req.body);
    const newSession =  await session.findById(fsession._id);
    fsession.room=req.params.id;
    await fsession.save()
    showRes(res,200,{
        newSession
    })
}
exports.getSession = async(req,res)=>{
    const fsession =  await session.findById("5e9c77a70262a229245d4689");
    showRes(res,200,fsession);
}
exports.postAnswer = async(req,res)=>{
}
exports.updateSession = async (req,res)=>{
    const fsession = await session.findById(req.params.id);
    const keys=["name","start","end","time"];
    keys.forEach(e => {
        if (req.body[e])
            fsession[e]=req.body[e];
    });
    fsession.save();
    showRes(res,200,{
        msg:"update success"
    })
}
exports.deleteSession = async(req,res)=>{
    const fsession = await session.findByIdAndDelete(req.params.id);
    showRes(res,200,{
        msg:"delete success"
    })
}
exports.pm = (...role)=>{
    return async(req,res,next) => {
        const fsession = await session.findById(req.params.id)
                                    .populate({path:"room",select:"adminRoom member"});
        const froom=fsession.room;
        if (!fsession) {
            showRes(res,404,"session ko ton tai");
            return;
        }
        if (role.includes("admin")){
            if (froom.adminRoom.id==req.id) {
                req.role="admin";
                return next()
            }
        }
        if (role.includes("member")){
            if (froom.member.some(e => e.id == req.id)){
                req.role="member";
                return next()
            }
        }
        showRes(res,401,"no pm");
        return;
    }
}