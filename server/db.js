var Sequelize = require('sequelize');

//initialize Sequelize with postgres with remote url
if (process.env.DATABASE_URL) {
  var db = new Sequelize(process.env.DATABASE_URL, {dialect: 'postgres', logging: false });
} else {
  // otherwise initialize Sequelize with postgres on your local machine
  var db = new Sequelize('socially', process.env.POSTGRES_USER, '', {dialect: 'postgres', logging: false });
}

db
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database', err);
  });

// create User table
var User = db.define('User', {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  image: Sequelize.STRING,
  // id: Sequelize.INTEGER,
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

// create Event table
var Event = db.define('Event', {
  location: Sequelize.STRING,
  date: Sequelize.DATE,
  title: Sequelize.STRING,
  time: Sequelize.STRING,
  category: Sequelize.STRING,
  description: Sequelize.STRING,
  image: Sequelize.TEXT,
  // id: Sequelize.INTEGER,
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
  //HostId (generated by join)
  //EventId (generated by join)

});

// create Message table
var Message = db.define('Message', {
  message: Sequelize.STRING,
  // id: Sequelize.INTEGER,
  ChatroomId:  Sequelize.INTEGER,
  UserId:  Sequelize.INTEGER,
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});


//create EventParticipant join table
var EventParticipant = db.define('EventParticipant', {
  host: Sequelize.BOOLEAN,
  // id: Sequelize.INTEGER,
  EventId: Sequelize.INTEGER,
  UserId: Sequelize.INTEGER
  //EventId (generated by join)
  //UserId (generated by join)
});

//sync individual tables listed above and create join tables
User.sync()
.then(() => User.belongsToMany(Event, {through: EventParticipant}))
.then(() => Event.belongsToMany(User, {through: EventParticipant }))
.then(() => Event.hasMany(Message, {foreignkey: {name: 'EventId'}}))
.then(() => Message.belongsTo(Event, {foreignkey: {name: 'EventId'}}))
.then(() => User.hasMany(Message, {foreignkey: {name:'UserId'}}))
.then(() => Message.belongsTo(User, {foreignkey: {name:'UserId'}}))
.then(() => User.sync())
.then(() => Event.sync())
.then(() => Message.sync());
// .then(() => Message.belongsTo(Event, {through: EventMessage }))
// .then(() => Event.belongsToMany(Message, {through: EventMessage }))

//export table schemas for use in other files
module.exports = {
  Event: Event,
  User: User,
  Message: Message,
  EventParticipant: EventParticipant,
};