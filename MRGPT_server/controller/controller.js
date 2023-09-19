import OpenAI from 'openai';

import 'dotenv/config'
const openai = new OpenAI({
    organization: process.env.ORGANISATION_KEY,
    apiKey: process.env.OPENAI_API_KEY,
    // dangerouslyAllowBrowser: true,
  });


export const callAPI = async(req,res)=>{
    const result = await openai.chat.completions.create({
        messages: req.query.messages,
        temperature: Number(req.query.temperature),
        model: req.query.model,
    });
    // console.log(result)
    res.send(result)
}

