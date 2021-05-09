const config = require("./config");
const Canvas = require("canvas");
const Discord = require("discord.js");
const { registerFont, createCanvas } = require('canvas')
registerFont('./NotoSansCJKjp-Black.otf', { family: 'Noto' })

module.exports = function (client) {

    client.on("guildMemberAdd", async member => {
      if(!member.guild) return;
      const canvas = Canvas.createCanvas(1772, 633);
      const ctx = canvas.getContext('2d');

      const background = await Canvas.loadImage(`./welcome.png`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#25b7c0'; //ケンブリッジブルー
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      //ユーザー名
      var textString3 = `${member.user.username}`;
      if (textString3.length >= 14) {
        ctx.font = 'bold 80px "Noto"';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 735, canvas.height / 2 + 20);
      }else {
        ctx.font = 'bold 100px "Noto"';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 735, canvas.height / 2 + 20);
      }

      //ユーザータグ
      var textString2 = `#${member.user.discriminator}`;
      ctx.font = 'bold 40px "Noto"';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString2, 730, canvas.height / 2 + 58);
      
      //メンバーカウント
      var textString4 = `Member #${member.guild.memberCount}`;
      ctx.font = 'bold 60px "Noto"';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 750, canvas.height / 2 + 125);

      //サーバ名
      var textString4 = `${member.guild.name}`;
      ctx.font = 'bold 60px "Noto"';
      ctx.fillStyle = '#25b7c0'; 
      ctx.fillText(textString4, 700, canvas.height / 2 - 150);

      //サークルの作成(mask)
      ctx.beginPath();
      ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      //プロフィール画像取得&描画
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
      ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

      let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter("Welcome", member.guild.iconURL({ dynamic: true }))
        .setDescription(`**${member.guild.name}へようこそ！ **\nMember: <@${member.id}> \n<#753261094398853252> チャンネルで利用規約に同意してください。`)
        .setImage("attachment://welcome-image.png")
        .attachFiles(attachment);
      let channel = member.guild.channels.cache.find(ch => ch.id === config.CHANNEL_WELCOME);
      channel.send(embed);

      let roles = config.ROLES_WELCOME;
      for(let i = 0; i < roles.length; i++ )
      member.roles.add(roles[i]);
    })
}


