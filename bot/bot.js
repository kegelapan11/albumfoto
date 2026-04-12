require("dotenv").config();
const TelegramBot=require("node-telegram-bot-api");
const axios=require("axios");

const bot=new TelegramBot(process.env.BOT_TOKEN,{polling:true});

const headers={
Authorization:`token ${process.env.GITHUB_TOKEN}`,
Accept:"application/vnd.github+json"
};

const REPO=process.env.REPO;
const BRANCH=process.env.BRANCH;
const USER=process.env.ALLOWED_USER;

async function upload(path,content,message){
let sha=null;
try{
const res=await axios.get(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,{headers});
sha=res.data.sha;
}catch{}
await axios.put(`https://api.github.com/repos/${REPO}/contents/${path}`,{
message,content,branch:BRANCH,sha
},{headers});
}

async function getData(){
try{
const res=await axios.get(`https://api.github.com/repos/${REPO}/contents/data.json?ref=${BRANCH}`,{headers});
return JSON.parse(Buffer.from(res.data.content,"base64").toString());
}catch{return [];}
}

bot.on("photo",async(msg)=>{
if(msg.from.id!=USER) return bot.sendMessage(msg.chat.id,"❌ Tidak diizinkan");
try{
bot.sendMessage(msg.chat.id,"⏳ Uploading...");
const caption=msg.caption||"";
const photo=msg.photo.pop();
const file=await bot.getFile(photo.file_id);
const url=`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
const filename=`foto_${Date.now()}.jpg`;

const res=await axios.get(url,{responseType:"arraybuffer"});
const base64=Buffer.from(res.data).toString("base64");

await upload(`images/${filename}`,base64,"upload foto");

const data=await getData();
data.unshift({file:filename,caption:caption,date:new Date().toISOString().split("T")[0]});

const json=Buffer.from(JSON.stringify(data,null,2)).toString("base64");
await upload("data.json",json,"update album");

bot.sendMessage(msg.chat.id,"✅ Masuk ke album!");
}catch(e){
console.log(e);
bot.sendMessage(msg.chat.id,"❌ Gagal upload");
}
});

bot.onText(/\/start/,(msg)=>{
bot.sendMessage(msg.chat.id,"📸 Kirim foto + caption");
});
