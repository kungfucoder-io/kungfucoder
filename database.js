var bcrypt = require('bcrypt-nodejs')
  , config = require('./config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(knex)
  , Users
  , UsersLogin
  , UsersBanned
  , UsersMessages
  , UsersNotifications
  , Jobs
  , DevelopersDetails
  , EmployersDetails
  , Tags
  , JobsTags
  , DevelopersTags
  , EmployersTags
  , Newsletters
  , NewslettersList
;

var save = bookshelf.Model.prototype.save;
bookshelf.Model.prototype.save = function () {
  return save.apply(this, arguments).then(function (model) {
    return model ? model.fetch() : model;
  })
};

Users = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'users_id',
  generateHash: function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.get('password'));
  },
  login: function () {
    return this.hasOne(UsersLogin, 'users_id');
  },
  banned: function () {
    return this.hasOne(UsersBanned, 'users_id');
  }
});

UsersLogin = bookshelf.Model.extend({
  tableName: 'users_login',
  idAttribute: 'users_login_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  }
});

UsersBanned = bookshelf.Model.extend({
  tableName: 'users_banned',
  idAttribute: 'users_banned_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  }
});

UsersMessages = bookshelf.Model.extend({
  tableName: 'users_messages',
  idAttribute: 'users_messages_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  toUser: function () {
    return this.belongsTo(Users, 'to_users_id');
  }
});

UsersNotifications = bookshelf.Model.extend({
  tableName: 'users_notifications',
  idAttribute: 'users_notifications_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  }
});

Jobs = bookshelf.Model.extend({
  tableName: 'jobs',
  idAttribute: 'jobs_id',
  employer: function () {
    return this.belongsTo(EmployersDetails, 'jobs_id');
  }
});

DevelopersDetails = bookshelf.Model.extend({
  tableName: 'developers_details',
  idAttribute: 'developers_details_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  tags: function () {
    return this.hasMany(DevelopersTags, 'developers_details_id');
  }
});

EmployersDetails = bookshelf.Model.extend({
  tableName: 'employers_details',
  idAttribute: 'employers_details_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  jobs: function () {
    return this.hasMany(Jobs, 'jobs_id');
  },
  tags: function () {
    return this.hasMany(EmployersTags, 'employers_details_id');
  }
});

Tags = bookshelf.Model.extend({
  tableName: 'tags',
  idAttribute: 'tags_id'
});

JobsTags = bookshelf.Model.extend({
  tableName: 'jobs_tags',
  idAttribute: 'jobs_tags_id',
  tags: function () {
    return this.hasMany(Tags, 'tags_id');
  },
  job: function () {
    return this.belongsTo(Jobs, 'jobs_id');
  }
});

DevelopersTags = bookshelf.Model.extend({
  tableName: 'developers_tags',
  idAttribute: 'developers_tags_id',
  tags: function () {
    return this.hasMany(Tags, 'tags_id');
  },
  developer: function () {
    return this.belongsTo(DevelopersDetails, 'developers_details_id');
  }
});

EmployersTags = bookshelf.Model.extend({
  tableName: 'employers_tags',
  idAttribute: 'employers_tags_id',
  tags: function () {
    return this.hasMany(Tags, 'tags_id');
  },
  employer: function () {
    return this.belongsTo(EmployersDetails, 'employers_details_id');
  }
});

Newsletters = bookshelf.Model.extend({
  tableName: 'newsletters',
  idAttribute: 'newsletters_id',
});

NewslettersList = bookshelf.Model.extend({
  tableName: 'newsletters_list',
  idAttribute: 'newsletters_list_id',
});