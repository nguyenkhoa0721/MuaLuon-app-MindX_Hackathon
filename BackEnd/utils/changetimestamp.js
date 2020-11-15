const changedTimestamp = (tg)=>{
    return parseInt(
        tg.getTime()/1000,
        10
    );
}
module.exports=changedTimestamp