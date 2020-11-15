const ErrShow = (res,status,message)=>{
    if (status!=200){
        res
            .status(status)
            .json({
                status:"fail",
                error: message
            })
    }
    else{
        const newMessage = Object.assign({}, {status:"success"}, message);
        res
            .status(status)
            .json(newMessage)
    }
}
module.exports=ErrShow