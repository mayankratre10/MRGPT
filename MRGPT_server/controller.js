import OpenAI from 'openai';

require('dotenv').config({path: __dirname + '/.env' })
const openai = new OpenAI({
    organization: process.env.ORGANISATION_KEY,
    apiKey: process.env.OPENAI_API_KEY,
    // dangerouslyAllowBrowser: true,
  });


const callAPI = async(req,res)=>{
    const result = await openai.chat.completions.create({
        messages: req.query.messages,
        temperature: Number(req.query.temperature),
        model: req.query.model,
    });
    // console.log(result)
    res.send(result)
}

module.exports = callAPI
