const {Router}=require('express')
const {urlModel,userModel}=require('../db')
// const jwt=require('jsonwebtoken')


const urlRouter=Router();

const isAuthenticated = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  };


urlRouter.post('/shorten',async(req,res)=>{
    const {originalUrl}=req.body;

    if(!originalUrl){
        return res.status(400).json({ message: 'Original URL is required.' });
    }
    try{
        let user=null;
        let expirationTime=null;

        if(req.user){
            user=req.user._id;
            expirationTime=null;
        }else{
            expirationTime=new Date(Date.now()+ 2*60*60*1000);
        }
        const url=new urlModel({
            originalUrl,
            isRegisteredUser:Boolean(user),
            userId:user ?user._id:null,
            expirationTime
        });

        await url.save();
        return res.status(200).json({
            message:'URL shortend successfully',
            shortUrl:`${req.protocol === 'https' || req.get('X-Forwarded-Proto') === 'https' ? 'https' : 'https'}://'minilynk'}/${url.shortId}`
        });
    }catch(err){
        return res.status(500).json({ message: 'Error in shortening URL' });
    }
})

urlRouter.get('/r/:shortId',async (req,res)=>{
    const { shortId } = req.params;
    try{
        const url=await urlModel.findOne({shortId});
        if(!url){
            return res.status(404).json({message:'URL not found'})
        }

        if (url.isRegisteredUser === false && url.expirationTime && new Date() > url.expirationTime) {
            return res.status(410).json({ message: 'URL has expired' });
          }

          res.redirect(url.originalUrl);

    }catch(err){
        return res.status(500).json({
            message:'Error in processing the request'
        })
    }   
})

module.exports=urlRouter