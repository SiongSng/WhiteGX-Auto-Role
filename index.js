const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const schedule = require('node-schedule');
const token = String(process.env.TOKEN);
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
let ready = false;
const RoleID = '888786927602499664'; //"太白粉" 身分組的ID

const rule = new schedule.RecurrenceRule();
rule.hour = new schedule.Range(1, 4); //凌晨1點到4點

const job = schedule.scheduleJob({
    rule: rule,
}, function (fireDate) {
    if (ready) { //如果機器人準備完成才執行動作
        let date = new Date(fireDate);
        let hour = date.getHours();
        console.log(`現在時間 ${date.toLocaleString()}`);

        const RoleChannl = client.channels.cache.get('890664639099187230'); // 身分組領取的頻道

        RoleChannl.permissionOverwrites.edit(RoleID, { VIEW_CHANNEL: false });

        if (hour == 1) { // 凌晨1點
            RoleChannl.permissionOverwrites.edit(RoleID, { VIEW_CHANNEL: true }); //開啟頻道權限
        } else if (hour == 4) { //凌晨4點
            RoleChannl.permissionOverwrites.edit(RoleID, { VIEW_CHANNEL: false }); //關閉頻道權限
        }
    }
});

console.log("機器人啟動中...")
client.once('ready', () => {
    ready = true;
    console.log(client.user.username + ' 準備完成!');
    console.log("本腳本將會於每天的凌晨一點至凌晨四點開放頻道給身分組\"太白粉\"瀏覽權限，其餘時間將關閉瀏覽權限");

    if (new Date().getHours() != 4) { //如果不是凌晨四點
        const RoleChannl = client.channels.cache.get('890664639099187230'); // 身分組領取的頻道
        RoleChannl.permissionOverwrites.edit(RoleID, { VIEW_CHANNEL: false }); //關閉頻道權限
    }
});

client.login(token);