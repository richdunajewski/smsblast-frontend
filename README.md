# smsblast-frontend

**Note:** This project is now calling `gvoice` directly from the command line rather than the `smsblast` bash script. This will provide better Windows compatibility.


## Prerequisites

- Node.js 0.10.x and up with NPM
- Bower package manager (`npm install -g bower`)
- pygooglevoice (several versions out there, we use https://code.google.com/r/kkleidal-pygooglevoiceupdate/)

## Installation

1. Run `git clone https://github.com/richdunajewski/smsblast-frontend.git`
2. `cd` into the **smsblast-frontend** directory.
3. Run `npm install` to install the Node.js dependencies.
4. `cd` into the assets directory.
5. Run `bower install` to install frontend dependencies.
6. Run `cd ..`
7. Copy **gv_credentials-example.json** to **gv_credentials.json** and update with your Google Voice account information.
8. `node app.js` to start the server.
9. Open http://localhost:7000/ in your browser.
10. Enjoy!