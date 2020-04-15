# Dat.io

**[Dat.io](https://bt-datingapp.herokuapp.com/)** is a dating application made with Node.js, Express and EJS which provides the main function of our application such as register, filter, like and match!

![Important screens](https://user-images.githubusercontent.com/48051912/79166750-22eb0880-7de6-11ea-9dc1-378b769ee34b.png)

This is a datingapp made together with [@RowanHorn](https://github.com/rowanhorn1412), [@VeerlePrins](https://github.com/veerleprins) and [@Joordy](https://github.com/joordy). With the application Dat.io makes it possible to register, logging in, filter the users, liking a user and ofcourse match with the users you like, when the interest is mutual. To read the process of creating the complete application, you can have a look in [our Wiki](https://github.com/joordy/BT-datingapp/wiki). Visit our application **[here](https://bt-datingapp.herokuapp.com/)**.

## Table of content

1. [Job Stories](#job-stories)
2. [Setup](#setup)
3. [Usage](#usage)
4. [Database](#database)
5. [License](#license)
6. [Resources](#resources)

## Job Stories :speech_balloon:

#### Register/login — Rowan:

> When a user is going to create a profile on the application for the first time, the user wants to be given various options to fill in his profile as independently as possible, so that other users who find his profile know exactly what kind of person the user is. The user also wants to be sure that his account is safe.

#### Filter — Veerle:

> When I sit on the couch at home with my phone in my hands, I want to be able to filter on the movie preferences of my possible matches, so that I don't have a fight in the future about which movie genre we're going to watch (for example on Netflix).

#### Liking/matching — Jordy:

> When the user is looking for a date, he wants to find one with mutual connections, so he can like them, and when the interest is mutual, they will be connected.

## Setup :wrench:

When you already have a connection with [Git](https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html), and installed [NodeJs](https://www.webucator.com/how-to/how-install-nodejs-on-mac.cfm) on your computer you can easilly download our project. If you haven't already installed these programs, I recommend to do that first.

### 1. Clone folder

You can clone our repository by typing the following command in your command-line:

`git clone https://github.com/joordy/BT-datingapp.git`

### 2. Install NPM Packages

Now you can navigate to the application, with `cd BT-datingapp`. The package.json file contains all the required modules. You can install all the necessary modules (stored in the dependencies) with the following command:

`npm install`

### 3. Run the code!

Go to the repository in the terminal and add the following line of code below:

`npm run start`

## Usage :globe_with_meridians:

You can visit [localhost:8000](http://localhost:8000/) to view the application. Or open the app with [Heroku](https://bt-datingapp.herokuapp.com/), to try the deployed version.

## Database :floppy_disk:

For the Datio dating application, we used a new database collection with all our users' data stored inside. This data consists of the following components:

![Database structure](https://user-images.githubusercontent.com/35265583/79114896-c3104580-7d84-11ea-8581-dd5cd8118323.png)

When you have liked some users, the database will look like this:
![Liked after](https://user-images.githubusercontent.com/35265583/79119645-1f796200-7d91-11ea-9f70-e754d5a6c96e.png)

## License :lock:

> You can see the license [here](https://github.com/joordy/BT-datingapp/blob/master/LICENSE).

This project is licensed under the terms of the MIT license.

## Resources :books:

- de Vries, D. (2018, September 9). Using GitHub as a team. - Danny de Vries. Retrieved March 18, 2020, from https://medium.com/@dandevri/using-github-as-a-team-61f189eaa8ff

- Einden, B. V. D. (2015, March 9). De psychologie van kleur. Retrieved March 18, 2020, from https://www.zoso.nl/blog/de-psychologie-van-kleur

- ExpressJS. (n.d.). Express routing. Retrieved April 1, 2020, from https://expressjs.com/en/guide/routing.html

- Expressjs. (n.d.). Security Best Practices for Express in Production. Retrieved April 4, 2020, from https://expressjs.com/en/advanced/best-practice-security.html#use-helmet

- Guru 99. (2020, February 12). Heroku vs AWS: 10 Most Important Differences You Must Know! Retrieved April 2, 2020, from https://www.guru99.com/heroku-vs-aws.html

- Helmet JS. (n.d.). XSS Filter - Helmet. Retrieved April 5, 2020, from https://helmetjs.github.io/docs/xss-filter/

- K, G. N. (2018, August 21). JavaScript: Promises or async-await - Better Programming. Retrieved March 14, 2020, from https://medium.com/better-programming/should-i-use-promises-or-async-await-126ab5c98789

- LaViska, C. (2017, February 8). Hashing Passwords with Node.js and Bcrypt. Retrieved April 11, 2020, from https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt

- Nodejs/express. regenerate session. (2012, February 2). Retrieved April 11, 2020, from https://stackoverflow.com/questions/9118018/nodejs-express-regenerate-session

- NPM. (2020, March 24). npm: helmet. Retrieved April 3, 2020, from https://www.npmjs.com/package/helmet

- P., A. (2017, May 27). adam-p/markdown-here. Retrieved March 1, 2020, from https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

- Vegibit. (n.d.). Node.js Routes Tutorial. Retrieved April 2, 2020, from https://vegibit.com/node-js-routes-tutorial/

- Watts, S. . (2020, June 15). SaaS vs PaaS vs IaaS: What’s The Difference and How To Choose. Retrieved April 2, 2020, from https://www.bmc.com/blogs/saas-vs-paas-vs-iaas-whats-the-difference-and-how-to-choose/

- XpertPhp. (n.d.). Node Js Routes In Separate File Using Express. Retrieved April 6, 2020, from https://xpertphp.com/node-js-routes-in-separate-file-using-express/

- NodeJS. (n.d.). — Download. Retrieved 2020, February 1, from https://nodejs.org/en/download/

- Express (n.d.). — Express Routing. Retrieved 2020, February 8, from https://expressjs.com/en/guide/routing.html

- The Net Ninja. (2016, May 25). — NodeJS Tutorial for Beginners. Retrieved 2020, February 12. [Video file] From https://www.youtube.com/watch?v=w-7RQ46RgxU&list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp

- Top Templating engines for Javascript. (2019, 13 June). — Alex Ivanovs. Retrieved 2020, February 19, from https://colorlib.com/wp/top-templating-engines-for-javascript/

- EJS -- Embedded JavaScript templating. (n.d.). Retrieved 2020, February 20, from https://ejs.co/

- PUG. (n.d.). — Getting Started – Pug. Retrieved 2020, February 21, from https://pugjs.org/api/getting-started.html

- Traversy Media (2016, 26 May). — NodeJS & Express from Scratch [Video file]. Retrieved 2020, 22 February, from https://www.youtube.com/watch?v=Ad2ngx6CT0M

- MongoDB (n.d.). - Get Started with Atlas - MongoDB Atlas. Retrieved 2020, March 10, from https://docs.atlas.mongodb.com/getting-started/

- MongoDb (n.d.). — Compass - MongoDB Compass. Retrieved 2020, March 11, from https://www.mongodb.com/products/compass

- MongoDB. (n.d.). — Find — MongoDB Manual. Retrieved 2020, March 16, from https://docs.mongodb.com/manual/reference/command/find/

- MongoDB. (n.d.). — Db.collection.updateOne() — MongoDB Manual. Retrieved 2020, 17 March, from https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/

- MongoDB. (2018, November 24). — How to use MongoDB with NodeJS - Flaviocopes. Retrieved 2020, 16 March, from https://flaviocopes.com/node-mongodb/

- MongoDB. (n.d.). — A Basic introduction to Mongo DB — MongoDB Node.JS Driver 1.4.9 documentation. Retrieved 2020, March 15, from https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html

- NPM. (n.d.). - MongoDB npm | npm Documentation. Retrieved 2020, March 12, from https://www.npmjs.com/package/mongodb

- NPM. (n.d.). — Npm-install | npm Documentation. Retrieved 2020, February 6, from https://docs.npmjs.com/cli/install

- M.D.N (2019, December 14). – Express Tutorial Part 4: Routes and controllers. Retrieved 2020, Match 30, from https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
