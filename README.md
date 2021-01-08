# Anchor

![Screenshot of Anchor on Jan 4 2021](./screenshot.png)

Anchor is the live streaming community website that powers
[WOKE.NET](https://woke.net).

The chat is powered by the open [Matrix](https://matrix.org) protocol. We use a
few custom state keys to dynamically update the stream on the page as well as
real-time announcements. This supports our own video hosting (also open source;
see [our Ansible repository for details][ansible]), as well as embedding
Twitch, YouTube, and Facebook live streams directly.

Our grid of livestreams is curated using [Streamwall][streamwall]. Curators use
[anchorbot][anchorbot] commands to update announcements and the livestream.


## Developing

Getting up and running is easy:

1. `npm install`
2. `npm run dev`


This will start a fully featured local instance of the site with working chat and live video. The chat will connect to the WOKE.NET public chatroom (you can set an alternate in [constants.json](https://github.com/wokenet/anchor/blob/17138cbfc272def345033dc930dd184909055cfe/constants.json#L8)). Changes made to React components will live update.

We use Matrix state events to determine what content to display on the front page. Check out [anchorbot][anchorbot] to see how this works.


## Deploying

This website is deployed using Netlify. Commits to the [`release`](https://github.com/wokenet/anchor/tree/release) branch will auto-deploy to the site.


## How to contribute

Want to add a feature, fix a bug, or discuss an idea? We'd love to collaborate!

Drop us a line in:

 - Matrix: [#anchor-development:woke.net][anchor-development]
-  Discord: #anchor on the [WOKE.NET Discord][discord]


[ansible]: https://github.com/wokenet/ansible/tree/main/roles/streamwall/tasks
[streamwall]: https://github.com/streamwall/streamwall
[anchorbot]: https://github.com/wokenet/anchorbot
[anchor-development]: https://matrix.to/#/#anchor-development:woke.net
[discord]: https://woke.net/discord
