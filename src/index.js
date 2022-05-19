const Discord = require('discord.js')
const { MessageAttachment } = require('discord.js')
const fetch = require('node-fetch')
const Canvas = require('canvas')
const { MessageEmbed } = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});
const token = 
'OTUxMjcyNTYzNzQ3NzQ1ODMz.YilDnA.zEKXspVFAjdQgXjt6ZWZre-Fpew'
client.on('ready', () => {
    console.log('bot logged in')
})
var emojiMap = {"BOS" : "972691008204722236",
             "MIL" : "972692026648834128",
             "GSW" : "972692276071530496",
             "MEM" : "972691644862304326",
             "ATL" : "975964329717432320",
             "PHI" : "975964571804246089",
             "SAS" : "975964790486867968",
             "NYK" : "975964834447380480",
             "DAL" : "975965017365151824",
             "SAC" : "971234890479706173",
             "CHI" : "975966422884839495",
             "LAL" : "975966475162636318",
             "PHX" : "975966673179906079",
             "TOR" : "975966752099950642",
             "LAC" : "975966984107872266",
             "IND" : "975967053691359272",
             "CHA" : "975967267173052437",
             "MIA" : "975967352535531600",
             "WAS" : "975967575001423882",
             "HOU" : "975967620085993522",
             "BKN" : "976671086991274005",
             "CLE" : "976671191098093639",
             "DEN" : "976671246873935903",
             "MIN" : "976671308827992065",
             "OKC" : "976671361336483850",
             "POR" : "976674044436955147",
             "UTA" : "976674085323030559"
               };
var answer = {
                team : "", conf : "",
                div : "", pos : "", ft : 0, in : 0,
                age : 0, num : 0, id : 0
}
var attempts = 0
const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
const prefix ='!'
client.on('messageCreate',async(msg) => {
    if (msg.content[0] !== prefix) {
        console.log('no prefix')
        return
    }

    const args = msg.content.slice(prefix.length).trim().split(' ')
    const command = args.shift().toLowerCase()
    
    score: if (command === 'scores') {
        var today = new Date()
        var yearD
        var yyyy = today.getFullYear()
        var mm = String(today.getMonth()+1).padStart(2,'0')
        var dd = String(today.getDate()).padStart(2,'0')
        var scoreDate = yyyy + mm + dd
        yearD = mm + "-" + dd + "-" + yyyy
        //console.log(scoreDate)
        if (args.length > 0) {
            if (args[0] === 'yesterday') {
                dd = String(today.getDate()-1).padStart(2,'0')
                scoreDate = yyyy + mm + dd
                yearD = mm + "-" + dd + "-" + yyyy

            }
            else {
                scoreDate = args[0]
                yearD = scoreDate
                scoreDate = scoreDate.replace(/-/g,'')
            }
        }
         console.log(scoreDate)
        let getScores = async () => {
            let result = await fetch
            (`http://data.nba.net/10s/prod/v1/${scoreDate}/scoreboard.json`)
            let json = await result.json()
            return json
        }
      
        let scores = await getScores()
        
        if (scores === undefined) {
            break score
        }
        const embed = new MessageEmbed() 
	        .setColor('#0099ff')
	        .setTitle(`Scores for ${yearD}`)


        var text = ''
        for (let i = 0; i < scores.games.length;i++) {
            text = ""
            let homeTeam = scores.games[i].hTeam
            let awayTeam = scores.games[i].vTeam
            var hScore
            var vScore
            var info
            if (homeTeam.score === "") {
                 hScore = homeTeam.score //0
            } else {
                 hScore = homeTeam.score
            }
            if (awayTeam.score === "") {
                 vScore = awayTeam.score //0
            } else {
                 vScore = awayTeam.score
            }
            var summary
            if (scores.games[i].seasonStageId === 4) {
                summary = scores.games[i].playoffs.seriesSummaryText

            }
            else {
                summary = "-------------------------------------"
            }

            if (scores.games[i].statusNum == 1) {
            
                info = " | Not yet started"
                
            } else if (scores.games[i].statusNum == 2) {
                info = " | Q" + scores.games[i].period.current + " " + scores.games[i].clock;
            } else {
                info = " | FINAL";
            }
            let hName = homeTeam.triCode
            let vName = awayTeam.triCode
            let hEmoji = "<:" + hName + ":" + emojiMap[hName] + ">"
            let vEmoji = "<:" + vName + ":" + emojiMap[vName] + ">"
            text += vEmoji + " " + vName + " " + vScore + " " + "@ "
            text += hScore + " " + hName + " " + hEmoji + " " + info
            embed.addField(text,summary)
        }
        msg.channel.send({ embeds: [embed]});
        //console.log(text)
        //msg.reply(` ${text} `)
        
        
    }
    if (command === 'stats') {
        const firstName = args[0]
        const lastName = args[1]
        var year = 2021
        if (args.length > 2) {
            year = args[2]
        }
        let getID = async () => {
         let result = await fetch
                (`https://www.balldontlie.io/api/v1/players?search=${lastName}&per_page=50`)
                let json = await result.json()
                return json
        }
            var playerID
            var playerTeam
            let ID = await getID()
            for (let i = 0; i < ID.data.length;i++) {
                if (ID.data[i].first_name === firstName) {
                    playerID = ID.data[i].id
                    playerTeam = ID.data[i].team.name

                }
            }
            let picID = async () => {
                let result = await fetch
                       ('https://data.nba.net/data/10s/prod/v1/2021/players.json')
                       let json = await result.json()
                       return json
               }
                   var playerpID
                   let pID = await picID()
                   var found = 0
                   for (let i = 0; i < pID.league.standard.length;i++) {
                       if (pID.league.standard[i].firstName === firstName && pID.league.standard[i].lastName === lastName) {
                           playerpID = pID.league.standard[i].personId
                           found = 1
                       }
                   }
            console.log(playerID)
            let getStats = async () => {
                let result = await fetch
                    (`https://www.balldontlie.io/api/v1/season_averages?season=${year}&player_ids[]=${playerID}`)
                    let json = await result.json()
                    return json
            }
            let stats = await getStats()
            var pic
            if (found === 1)
                pic = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerpID}.png`
            else 
                pic = "https://cdn.freebiesupply.com/images/large/2x/nba-logo-transparent.png"
            console.log(pic)
            let ppg = Math.round((stats.data[0].pts)*10)/10
            let ast = String(Math.round((stats.data[0].ast)*10)/10)
            let reb = String(Math.round((stats.data[0].reb)*10)/10)
            let stl = String(Math.round((stats.data[0].stl)*10)/10)
            let blk = String(Math.round((stats.data[0].blk)*10)/10)
            let test = stats.data[0].fg_pct*100
            let test2 = stats.data[0].fg3_pct*100
            let fg = String(Math.round(test * 10) / 10)
            let p3 = String(Math.round(test2 * 10) / 10)
            console.log(ppg)
            let fullName = firstName + " " + lastName
            let year2 = parseInt(year)+1
            let fullYear = year + "-" + year2 + " | " + playerTeam
            const statsEmbed = new MessageEmbed() 
	            .setColor('#0099ff')
	            .setTitle(fullName)
                .setDescription(fullYear)
                .setThumbnail(pic)
                .addField('PPG',String(ppg))
                .addField('AST',ast)
                .addField('REB',reb)
                .addField('STL',stl)
                .addField('BLK',blk)
                .addField('FG%',fg)
                .addField('3P%',p3)
            msg.channel.send({ embeds: [statsEmbed]});
            

    }
    

    if (command === 'compare') {
        const canvas = Canvas.createCanvas(1200,1400)
        const context = canvas.getContext('2d')
        const background = await Canvas.loadImage('black.png')
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = '50px sans-serif';
        context.fillStyle = '#D3D3D3';
        context.fillText("PPG",530,400)
        context.fillText("AST",530,550)
        context.fillText('REB',530,700)
        context.fillText('FG%',530,850)
        context.fillText("3P%",530,1000)
        context.fillText("STL",530,1150)
        context.fillText('BLK',530,1300)

        var firstName1 = args[0];
        var lastName1 = args[1];
        var firstName2;
        var lastName2;

        var year1 = 2021
        var year2 = 2021
        if (args.length > 4) {
            year1 = args[2]
            year2 = args[5]
            firstName2 = args[3]
            lastName2 = args[4]
        }
        else {
            firstName2 = args[2]
            lastName2 = args[3]
        }
        let getID1 = async () => {
         let result = await fetch
                (`https://www.balldontlie.io/api/v1/players?search=${lastName1}&per_page=50`)
                let json = await result.json()
                return json
        }
            var playerID1
            //var playerTeam
            let ID = await getID1()
            for (let i = 0; i < ID.data.length;i++) {
                if (ID.data[i].first_name === firstName1) {
                    playerID1 = ID.data[i].id
                    //playerTeam = ID.data[i].team.name

                }
            }

            let getID2 = async () => {
                let result = await fetch
                       (`https://www.balldontlie.io/api/v1/players?search=${lastName2}&per_page=50`)
                       let json = await result.json()
                       return json
               }
                   var playerID2
                   //var playerTeam
                   let ID2 = await getID2()
                   for (let i = 0; i < ID2.data.length;i++) {
                       if (ID2.data[i].first_name === firstName2) {
                           playerID2 = ID2.data[i].id
                           //playerTeam = ID2.data[i].team.name
       
                       }
                   }


                   let getStats = async () => {
                    let result = await fetch
                        (`https://www.balldontlie.io/api/v1/season_averages?season=${year1}&player_ids[]=${playerID1}`)
                        let json = await result.json()
                        return json
                }
                let stats1 = await getStats()

                let getStats2 = async () => {
                    let result = await fetch
                        (`https://www.balldontlie.io/api/v1/season_averages?season=${year2}&player_ids[]=${playerID2}`)
                        let json = await result.json()
                        return json
                }
                let stats2 = await getStats2()


                let ppg1 = Math.round((stats1.data[0].pts)*10)/10
                let ast1 = String(Math.round((stats1.data[0].ast)*10)/10)
                let reb1 = String(Math.round((stats1.data[0].reb)*10)/10)
                let ppg2 = Math.round((stats2.data[0].pts)*10)/10
                let ast2 = String(Math.round((stats2.data[0].ast)*10)/10)
                let reb2 = String(Math.round((stats2.data[0].reb)*10)/10)
                let stl1 = String(Math.round((stats1.data[0].stl)*10)/10)
                let stl2 = String(Math.round((stats2.data[0].stl)*10)/10)
                let blk1 = String(Math.round((stats1.data[0].blk)*10)/10)
                let blk2 = String(Math.round((stats2.data[0].blk)*10)/10)

                context.font = '60px sans-serif';
                context.fillStyle = '#FFFFFF';
                let test = stats1.data[0].fg_pct*100
                let test2 = stats1.data[0].fg3_pct*100
                let fg1 = String(Math.round(test * 10) / 10)
                let p31 = String(Math.round(test2 * 10) / 10)
                let t = stats2.data[0].fg_pct*100
                let t2 = stats2.data[0].fg3_pct*100
                let fg2 = String(Math.round(t * 10) / 10)
                let p32 = String(Math.round(t2 * 10) / 10)
                var fullName1 = firstName1 + " " + lastName1
                var fullName2 = firstName2 + " " + lastName2
                let yearPlusOne2 = parseInt(year2)+1
                let yearPlusOne = parseInt(year1)+1
                var fullyear1 = year1 + "-" + yearPlusOne
                var fullyear2 = year2 + "-" + yearPlusOne2
                context.fillText(fullyear1,75,200)
                context.fillText(fullName1,75,100)
                context.fillText(ppg1,375,400)
                context.fillText(ast1,375,550)
                context.fillText(reb1,375,700)
                context.fillText(fg1,375,850)
                context.fillText(p31,375,1000)
                context.fillText(stl1,375,1150)
                context.fillText(blk1,375,1300)
                context.fillText(fullName2,700,100)
                context.fillText(fullyear2,700,200)
                context.fillText(ppg2,660,400)
                context.fillText(ast2,660,550)
                context.fillText(reb2,660,700)
                context.fillText(fg2,660,850)
                context.fillText(p32,660,1000)
                context.fillText(stl2,660,1150)
                context.fillText(blk2,660,1300)
                


        const attachment = new MessageAttachment(canvas.toBuffer())

        
        msg.reply({ files: [attachment] });
    }
    if (command === 'standings') {
        let getStandings = async () => {
            let result = await fetch
                   (`http://data.nba.net/prod/v1/current/standings_conference.json`)
                   let json = await result.json()
                   return json
           }
           let st = await getStandings()
           let east = st.league.standard.conference.east
           let west = st.league.standard.conference.west
           //console.log(east)
           const embed = new MessageEmbed() 
	            .setColor('#0099ff')
	            .setTitle("NBA standings")
           var teamName
           var win
           var loss
           var data1 = ""
           var gamesBehind
           for (var i = 0; i < east.length; i++) {
                teamName = east[i].teamSitesOnly.teamNickname
                win = east[i].win
                loss = east[i].loss
                gamesBehind = east[i].gamesBehind
                if (gamesBehind === "0.0") {
                    gamesBehind = "-"
                }
                data1 = data1 + "\n" + teamName + ' ' + win + '-' + loss + " (" + gamesBehind + ")"
           }
           var data = ""
           for (var i = 0; i < west.length; i++) {
            teamName = west[i].teamSitesOnly.teamNickname
            win = west[i].win
            loss = west[i].loss
            gamesBehind = east[i].gamesBehind
            if (gamesBehind === "0.0") {
                gamesBehind = "-"
            }
            data = data + "\n" + teamName + ' ' + win + '-' + loss + " (" + gamesBehind + ")"
       }
           
            embed.addField("East",data1)
            embed.addField("West",data) 
            msg.channel.send({ embeds: [embed]});
    }
    if (command === "start") {
        let getPlayer = async () => {
            let result = await fetch
                   (`http://data.nba.net/prod/v1/2021/players.json`)
                   let json = await result.json()
                   return json
           }
           let p = await getPlayer()
           var players = p.league.standard
           var num = Math.floor(Math.random() * (505 - 0 + 1) + 0)
           attempts = 0
           var player = players[num]
           answer.pos = player.pos
           console.log(answer.pos)
           answer.ft = parseInt(player.heightFeet)
           answer.in = parseInt(player.heightInches)
           var date = player.dateOfBirthUTC
           var age = getAge(date)
           answer.id = player.personId
           answer.age = age
           answer.num = parseInt(player.jersey)
           var teamID = player.teamId

           let teamInfo = async () => {
            let result = await fetch
                   (`http://data.nba.net/prod/v2/2021/teams.json`)
                   let json = await result.json()
                   return json
           }
           let team = await teamInfo() 
           var teams = team.league.standard
           for (var i = 0; i < teams.length; i++) {
               if (teams[i].teamId === teamID) {
                   answer.team = teams[i].nickname 
                   answer.conf = teams[i].confName
                   answer.div = teams[i].divName

               }
           }

    }
    if (command === "guess") {
        attempts++
        var fName = args[0]
        var lName = args[1]
        var fullName = fName + " " + lName
        let getPlayer = async () => {
            let result = await fetch
                   (`http://data.nba.net/prod/v1/2021/players.json`)
                   let json = await result.json()
                   return json
           }
           let pl = await getPlayer()
           var players = pl.league.standard
           var teamID
           var gTeam,gConf,gDiv,gFt,gIn,gPos,gAge,gNum,gID

           for (var i = 0; i < players.length; i++) {
               if (players[i].firstName === fName && players[i].lastName === lName) {
                    teamID = players[i].teamId
                    gFt = parseInt(players[i].heightFeet)
                    gIn = parseInt(players[i].heightInches)       
                    gPos = players[i].pos
                    gNum = parseInt(players[i].jersey)    
                    var date = players[i].dateOfBirthUTC
                    var age = getAge(date)    
                    gAge = age
                    gID = players[i].personId     
               }

           }

           let teamInfo = async () => {
            let result = await fetch
                   (`http://data.nba.net/prod/v2/2021/teams.json`)
                   let json = await result.json()
                   return json
           }
           let team = await teamInfo() 
           var teams = team.league.standard
           for (var i = 0; i < teams.length; i++) {
               if (teams[i].teamId === teamID) {
                   gTeam = teams[i].nickname 
                   gConf = teams[i].confName
                   gDiv = teams[i].divName
                   

               }
           }
           
           
            const embed = new MessageEmbed() 
	            .setColor('#0099ff')
	            .setTitle(fullName)
            var data
            data = gTeam
            if (gTeam === answer.team) {
                data += "  " + ":white_check_mark:"
            }
           embed.addField("Team",data)
           data = gConf
           if (gConf === answer.conf) {
                data += "  " + ":white_check_mark:"
           }
           embed.addField("Conference",data)
           data = gDiv
           if (gDiv === answer.div) {
               data += "  " + ":white_check_mark:" 
           }
           embed.addField("Division",data)
           data = gPos
           console.log(gPos)
           console.log(answer.pos)
           if (gPos === answer.pos || gPos.split('').reverse().join('') === answer.pos) {
                data += "  " + ":white_check_mark:"
           }
           else if (answer.pos.includes(gPos)) {
               data += "  " + ":yellow_circle:"
           }
           else if (gPos.includes(answer.pos)) {
               data += "  " + ":yellow_circle:"
           }
           embed.addField("Position",data)
           var fullHeight = gFt + "'" + gIn + "\""
           data = fullHeight
           var gInches = (gFt*12) + gIn
           var aInches = (answer.ft*12) + answer.in
           if (gInches === aInches) {
               data += "  " + ":white_check_mark:"
           }
           else  {
               if (gInches > aInches) {
                data += "  " + ":arrow_down:"
               }
               else {
                data += "  " + ":arrow_up:"
               }
               if (Math.abs(gInches - aInches) < 3) {
                    data += "  " + ":yellow_circle:"                  
               }
           }   
           embed.addField("Height",data)
           data = gAge
           if (gAge === answer.age) {
               data += "  " + ":white_check_mark:"
           }
           else {
               if (gAge > answer.age) {
                   data += "  " + ":arrow_down:"
               }
               else {
                   data += "  " + ":arrow_up:"
               }

               if (Math.abs(gAge - answer.age) < 3) {
                   data += "  " + ":yellow_circle:"
               }
           }
           embed.addField("Age",data)
           data = gNum
           if (gNum === answer.num) {
               data += "  " + ":white_check_mark:"
           }
           else {
               if (gNum > answer.num) {
                   data += "  " + ":arrow_down:"
               }
               else {
                   data += "  " + ":arrow_up:"
               }

               if (Math.abs(gNum - answer.num) < 3) {
                   data += "  " + ":yellow_circle:"
               }
           }
           embed.addField("Number",data)

           msg.channel.send({ embeds: [embed]});
           var text = "Congrats, you correctly guessed " + fullName + " in " + attempts + " attempts!"
           if (gID === answer.id) {
               msg.channel.send(text)
        }

           
    }
    if (command === "boxscore") {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        if (args[1] === "yesterday") {
            dd = String(today.getDate()-1).padStart(2, '0');
            console.log(dd)
        }
        today = yyyy + mm + dd
        var name = args[0]
        console.log(today)
        let getTeamID = async () => {
            let result = await fetch
            (`http://data.nba.net/10s/prod/v1/${today}/scoreboard.json`)
            let json = await result.json()
            return json
        }
        let scores = await getTeamID()
        var gameID
        for (var i = 0; i < scores.games.length;i++) {
            var vis = scores.games[i].vTeam.triCode
            var home = scores.games[i].hTeam.triCode
            if (name === vis || name === home) {
                gameID = scores.games[i].gameId
            }
        }
        let getBoxscore = async () => {
            let result = await fetch
            (`http://data.nba.net/prod/v1/${today}/${gameID}_boxscore.json`)
            let json = await result.json()
            return json
        }
        let box = await getBoxscore()
        var data1 = box.basicGameData
        var d2 = box.stats.activePlayers
        //console.log(data2)
        var title = data1.vTeam.triCode + " " + data1.vTeam.score
        title += " @ " + data1.hTeam.score + " " + data1.hTeam.triCode
        const embed = new MessageEmbed() 
	            .setColor('#0099ff')
	            .setTitle(title)
        var pData = ""
        var substr
        var time
        var j = 0
        var disp = data1.vTeam.triCode + " -----------------------------------"
        var info = "MIN | FG | 3PT | FT | REB | AST | STL | BLK | PTS"
        embed.addField(disp,info)
        for (var i = 0; i < d2.length; i++) {
             j++
             pData = ""
             substr = d2[i].min.substring(0,2)
             time = parseInt(substr)
             if (time === 0) {
                 break
             }
             pData += d2[i].min + " | " + d2[i].fgm + "-" + d2[i].fga
             pData += " | " + d2[i].tpm + "-" + d2[i].tpa + " | "
             pData += d2[i].ftm + "-" + d2[i].fta + " | " + d2[i].totReb + " | "
             pData += d2[i].assists + " | " + d2[i].steals + " | " + d2[i].blocks + " | " + d2[i].points
             embed.addField(d2[i].lastName,pData)
        }
        disp = data1.hTeam.triCode + " -----------------------------------"
        embed.addField(disp,info)
        for (var i = j; i < d2.length; i++) {
            pData = ""
            substr = d2[i].min.substring(0,2)
            time = parseInt(substr)
            //console.log(time)
            if (time != 0) {
                pData += d2[i].min + " | " + d2[i].fgm + "-" + d2[i].fga
                pData += " | " + d2[i].tpm + "-" + d2[i].tpa + " | "
                pData += d2[i].ftm + "-" + d2[i].fta + " | " + d2[i].totReb + " | "
                pData += d2[i].assists + " | " + d2[i].steals + " | " + d2[i].blocks + " | " + d2[i].points
                embed.addField(d2[i].lastName,pData)
            }
        }
        //embed.addField(data1.vTeam.triCode,pData)
        msg.channel.send({ embeds: [embed]});
    }
})


client.login(token)