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
    const jsona = await response.json();
    botMain(jsona, room);
    if(checkOnce === false){
        console.log(`INFO: ${usr} has been started. Listening on room "${room}"`);
        checkOnce = true;
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
                if(cont.startsWith(`${pre}time`)){
                    sendMessage(usr, clr, `Your message time was ${jsona["time"]}. Response time is ${jsona["time"] - (new Date().getTime() / 1000)}s`, room);
                } else if(cont.startsWith(`${pre}tz `)){
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
                    
                    
                   
                } else {
                    sendMessage(usr, clr, "Test (written in NodeJS)", room);
                }
                
            }
            
        }        

    } catch(error) {
        console.log(error);
    }


}
setInterval(function(){ getMsg("blue"); getMsg("green"); }, 1000);