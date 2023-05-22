const db = require('../scrumBoardModel');

const userController = {};


// CHECK USERNAME IN DATABASE --------------------------------------------------------------------------------------------------------------------------------------
userController.checkUsername = (req, res, next) => {
	const { username, password } = req.body;
	const values = [username];
	const queryString = `SELECT * FROM "public"."user"
	WHERE username = $1`;

	db.query(queryString, values)
		.then((data) => {
			if (data.rows[0] !== undefined) {
				res.locals.status = 'UserNameExists';
				return next();
			} else {
        // console.log('Username does not already exist');
        res.locals.newUser = { username, password };
        res.locals.status = 'valid';
        return next();
      }
		})
		.catch((err) => {
			const errorObj = {
				log: `userController.createUser middleware error ${err.message}`,
				status: 501,
				message: 'Login failed',
			};
			return next(errorObj);
		});
};


// CREATE USER ------------------------------------------------------------------------------------------------------------------------------------------------
userController.createUser = (req, res, next) => {
	// console.log('Inside create user');
	if (res.locals.status !== 'valid') {
		// console.log('username matched, not actually creating new user');
		return next();
	}
	const { newUser } = res.locals;
	const values = [newUser.username, newUser.password];
	const queryString = `INSERT INTO "public"."user" (username, password)
	VALUES ($1, $2)
  RETURNING username, id AS user_id`;
	// console.log('queryString: ', queryString);
	db.query(queryString, values)
		.then((data) => {
      res.locals.user = data.rows[0];
      res.locals.user.userTeams = [];
			delete res.locals.newUser;
			return next();
		})
		.catch((err) => {
			const errorObj = {
				log: `userController.createUser middleware error ${err.message}`,
				status: 501,
				message: 'Login failed',
			};
			return next(errorObj);
		});
};


// VERIFY USER LOGIN ---------------------------------------------------------------------------------------
userController.verifyUser = (req, res, next) => {
	const { username, password } = req.body;
	const values = [username];
	const queryString = `
	SELECT * FROM "public"."user"
	WHERE username = $1`;

	db.query(queryString, values)
		.then((data) => {
			// console.log('data.rows[0]: ', data.rows[0]);
			if (data.rows[0] === undefined) {
				res.locals.status = 'UserNotFound';
				return next();
      }
      
      // If we reach here, it means that the user was found in the database. 
      // Now we can check to see if the password is a match
			const dbPass = data.rows[0].password;
			if (dbPass !== password) {
				res.locals.status = 'IncorrectPassword';
				return next();
      } 

      // If we reached here, dbPass must be strictly equal to the password. Therefore we'll send pertinent
      res.locals.user = {
        user_id: data.rows[0].id,
        username: data.rows[0].username
      };
      res.locals.status = 'valid';
      return next();
      
		})
		.catch((err) => {
			const errorObj = {
				log: `userController.verifyUser middleware error ${err.message}`,
				status: 501,
				message: 'Login failed',
			};
			return next(errorObj);
		});
};


// GET TEAMS FOR USER ---------------------------------------------------------------------------------------------------------------------------------
userController.getTeams = (req, res, next) => {

  // res.locals.user will be undefined in the following two cases:
  // 1. We're in path for userRouter.post('/login'...) and verify user didn't find a username/password match
  // 2. We're in path for userRouter.post('/join-team...) grabbing teams the first time
  if (res.locals.user === undefined) {
    const { user_id } = req.body;
    if (user_id === undefined) {
      // If this was true, we've confirmed we're in case 1. Move on without executing rest of controller
      return next();
    }
    //If we reached here it means we're in case 2, so we add the user_id to proceed
    res.locals.user = { user_id };
  }
  
  const values = [res.locals.user.user_id];
	const queryString = `
	SELECT t.id, t.team_name
	FROM "public"."userTeam" ut INNER JOIN "public"."team" t
	ON ut.user_id = $1 AND ut.team_id = t.id`;

	db.query(queryString, values)
		.then((data) => {
			res.locals.user.userTeams = data.rows;
			return next();
		})
		.catch((err) => {
			const errorObj = {
				log: `userController.getTeams middleware error ${err.message}`,
				status: 501,
				message: 'Login failed',
			};
			return next(errorObj);
		});
};


// CREATE TEAM ---------------------------------------------------------------------------------------
userController.createTeam = (req, res, next) => {
	//destruct team_name from fetch
	const { team_name, user_id } = req.body;
	//insert new team with team_name into team table
	const values = [team_name];
	const queryString = `INSERT INTO "public"."team" (team_name)
  VALUES ($1)
  RETURNING id`;

	db.query(queryString, values)
		.then((data) => {
			//add team_id to res.locals
      res.locals.team_id = data.rows[0].id;
      // Add user to res.locals so userController.joinTeam has necessary variables 
      res.locals.user = {
        user_id,
        userTeams: []
      }
			// console.log('team_id of newly created team:', res.locals.team_id);
			return next();
		})
		.catch((err) => {
			return next({
				log: `userController.createTeam middleware error: ${err.message}`,
				status: 501,
				message: 'Team creation failed',
			});
		});
};


// JOIN TEAM ---------------------------------------------------------------------------------------
userController.joinTeam = (req, res, next) => {
	//take in user_id from res.locals from userController.getTeams
	const { user_id, userTeams } = res.locals.user;

	//take in a team_id from either res.locals or req.params
  const team_id = res.locals.team_id || req.params.team_id;
  
	// add team_id to res.locals, just in case it was retrieved from req.params
  // Change it to a number so it can be strictly compared to userTeams array ids
	res.locals.team_id = Number(team_id);

  for (const userTeam of userTeams) {
    if (userTeam.id === res.locals.team_id) {
			//if they're already on the team, return something on res.locals to frontend that can check it
      res.locals.teamAddStatus = 'AlreadyMember';
      return next();
    }
  }

	//query team db to make sure team_id is in team table
	const teamValues = [team_id];
	const teamQueryString = `SELECT * FROM "public"."team"
    WHERE id = $1`;
	// console.log('in start of join team');
	db.query(teamQueryString, teamValues)
		.then((data) => {
			// console.log('in join team query 1');
			// console.log(data.rows.length);
			if (data.rows.length === 0) {
				//if no results are returned from query, return something on res.locals to frontend that can check it
				res.locals.teamAddStatus = 'InvalidURL';
				// console.log('no team at this url');
				return next();
      } else {
        
				//if it does exist, insert user_id and team_id into userTeam table
				const userTeamValues = [user_id, team_id];
				const userTeamQueryString = `INSERT INTO "public"."userTeam" (user_id, team_id)
          VALUES ($1, $2)`;

				db.query(userTeamQueryString, userTeamValues)
					.then((data) => {
						// console.log('in join team query 2');
						//if insert successful, send confirmation to frontend
            res.locals.teamAddStatus = 'Success';
            console.log()
						return next();
					})
					.catch((err) => {
						// console.log('in join team query 2 catch statement');
						return next({
							log: `userController.joinTeam middleware error: ${err.message}`,
							status: 501,
							message:
								'Failed to execute query to add user_id and team_id to userTeam table',
						});
					});
			}
		})
		.catch((err) => {
			return next({
				log: `userController.joinTeam middleware error: ${err.message}`,
				status: 501,
				message: 'Failed to execute query to find team id in team table',
			});
		});
};


module.exports = userController;
