<h1 align="center">Discord.js - AutoMod</h1>
<p align="center">
  <a href="https://github.com/Emsa001/Discord.js - AutoMod/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/Emsa001/Discord.js - AutoMod?style=flat-square" alt="Discord.js - AutoMod license" />
  </a>
  <a href="https://github.com/Emsa001/Discord.js - AutoMod/fork" target="_blank">
    <img src="https://img.shields.io/github/forks/Emsa001/Discord.js - AutoMod?style=flat-square" alt="Discord.js - AutoMod forks" />
  </a>
  <a href="https://github.com/Emsa001/Discord.js - AutoMod/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/Emsa001/Discord.js - AutoMod?style=flat-square" alt="Discord.js - AutoMod stars" />
  </a>
  <a href="https://github.com/Emsa001/Discord.js - AutoMod/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/Emsa001/Discord.js - AutoMod?style=flat-square" alt="Discord.js - AutoMod issues" />
  </a>
  <a href="https://github.com/Emsa001/Discord.js - AutoMod/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/Emsa001/Discord.js - AutoMod?style=flat-square" alt="Discord.js - AutoMod issues-pr" />
  </a>
  <a href="https://github.com/Emsa001/Discord.js - AutoMod/" target="_blank">
    <img src="https://img.shields.io/github/languages/count/Emsa001/Discord.js - AutoMod?style=flat-square" alt="Discord.js - AutoMod languages/count" />
  </a>
</p>

Discord.js bot for applications and auto roles

## 🚀 Demo

Discord Server: [https://discord.gg/euV4nHA5yB](https://discord.gg/euV4nHA5yB)

![AutoRoles](https://i.imgur.com/mFLZoYB.png)
![Applications](https://i.imgur.com/luHrtlb.png)
![Application's modal](https://i.imgur.com/UZneNPW.png)
![Application created](https://i.imgur.com/QCXg50N.png)
![Application accepted](https://i.imgur.com/2EWeSMG.gif)
![Application accepted](https://i.imgur.com/YTujM8A.png)

## 🛠️ Installation Steps

1. Install components

```bash
npm install
```

2. Create .env file

```env
DISCORD_BOT_CLIENTID=
DISCORD_BOT_TOKEN=
```

3. Fill database/database.js with your mysql data

```javascript
const { Sequelize } = require('sequelize');
module.exports = new Sequelize('', '', '', {
    host: '',
    dialect: 'mysql',
    logging: false,
});
```

4. Fill config.json with your data

```json
{
    "roles": {
        "news": "",
        "updates": "",
        "leaks": ""
    },

    "icons": {
        "minereality": "",
        "newGenerationServers": ""
    },
    "iconURL": "",
    "channels": {
        "applicationsParentId": "",
        "applicationArchives": ""
    },
    "registerChannel": "",
    "notificationsChannel": "",
    "applicationChannel": "",
    "applicationReviewChannel": ""
}
```

You are all set! ✨

## 🚧 Contributors

-   Emanuel Scura: [Github](https://github.com/Emsa001) [Linkdin](https://www.linkedin.com/in/emanuel-scura-447542240/) [Discord](Emsa001#7224)

Thank you so much for your help.
