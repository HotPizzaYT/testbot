const usr = "TestBot";
const clr = "#808080";
const pre = "?";
var checkOnce = false;
// This variable is so that the bot doesn't repeat the same message by accident.
var lastmsgtime = 0;
function isTimeZoneValid(timeZone) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone });
      return true;
    } catch (error) {
      if (error instanceof RangeError) {
        return false;
      }
      return false; // Propagate other errors
    }
}

const getMsg = async function(room){
    const response = await fetch(`http://3dstownsquare.com/chat/fmsg.php?room=${encodeURIComponent(room)}`);
    try {
        const jsona = await response.json();
        botMain(jsona, room);
        if(checkOnce === false){
            console.log(`INFO: ${usr} has been started. Listening on room "${room}"`);
            checkOnce = true;
        }
    } catch(error){
        console.log(error);

    }

};
const sendMessage = async function(username, color, message, room){
    await fetch("http://3dstownsquare.com/chat/send.php", {
        "credentials": "include",
        "headers": {
            "User-Agent": "TestBot v1.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "referrer": "http://3dstownsquare.com/chat/room.php?r=blue",
        "body": `nick=${encodeURIComponent(username)}&color=${encodeURIComponent(color)}&msg=${encodeURIComponent(message)}&room=${encodeURIComponent(room)}`,
        "method": "POST",
        "mode": "cors"
    });
}
const botMain = function(jsona, room){
    try {
        const cont = jsona["content"];
        const color = jsona["color"];
        const time = jsona["time"];
        const usernme = jsona["username"];
        if(cont.startsWith(pre)){
            if(usernme !== usr & (time !== lastmsgtime)){
                lastmsgtime = jsona["time"];
                if(cont.startsWith(`${pre}tz `)){
                    const tz = cont.replace(`${pre}tz `, "");
                    if(isTimeZoneValid(tz)){
                        const options = {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: tz,
                          };
                          
                        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date());
                        sendMessage(usr, clr, `It is currently ${formattedTime} in ${tz}.`, room);
                    } else if(isTimeZoneValid(tz) === false){
                        sendMessage(usr, clr, "That is an invalid timezone! Timezones must be in <country>/<city> format! A complete list of timezones can be found at https://raw.githubusercontent.com/leon-do/Timezones/main/timezone.json", room);
                    }
                    
                    
                   
                } else if(cont === `${pre}ping`){
                    sendMessage(usr, clr, `Pong! ${Math.floor(new Date().getTime()) - (jsona["time"])}ms`, room);
                } else if(cont === `${pre}help`){
                    sendMessage(usr, clr, `Here is a list of commands: ${pre}ping: Check ping time from message to bot, ${pre}tz: Check timezone in another area, ${pre}say: Get the bot to say something.`, room);
                    sendMessage(usr, clr, `${pre}banana: Pick a number from 1 to 255, ${pre}8ball: Ask 8 ball a question`, room);
                } else if(cont === `${pre}banana`){
                    sendMessage(usr, clr, `Banana Number: ${Math.floor(Math.random() * (255 - 1) + 1)}`, room);
                } else if(cont.startsWith(`${pre}say `)){
                    sendMessage(usr, clr, cont.replace(`${pre}say `, ""), room)
                } else if(cont.startsWith(`${pre}8ball `)){
                    const ans = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
                    const random = Math.floor(Math.random() * ans.length);
                    sendMessage(usr, clr, ans[random], room);
                } else {
                    sendMessage(usr, clr, `Unknown command. Do ${pre}help for a list of commands.`, room);
                }
                
            }
            
        }        

    } catch(error) {
        console.log(error);
    }


}
setInterval(function(){ getMsg("blue"); getMsg("green"); }, 1000);