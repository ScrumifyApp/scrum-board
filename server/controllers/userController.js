const db = require('../scrumBoardModel');

const userController = {};

userController.createTeam = (req, res, next) => {
	//destruct team_name from fetch
	const { team_name } = req.body;
	//insert new team with team_name into team table
	const values = [team_name];
	const queryString = `INSERT INTO "public"."team" (team_name)
  VALUES ($1)
  RETURNING id`;

	db.query(queryString, values)
		.then((data) => {
			//add team_id to res.locals
			res.locals.team_id = data.rows[0].id;
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

userController.joinTeam = (req, res, next) => {
	//take in user_id from req.body
	const { user_id } = req.body;
	//take in a team_id from either res.locals or req.params

	// console.log('res.locals.team_id', res.locals.team_id);
	// console.log('req.params', req.params);

	const team_id = res.locals.team_id || req.params.team_id;
	//add team_id to res.locals
	res.locals.team_id = team_id;

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
				res.locals.teamAdded = false;
				// console.log('no team at this url');
				return next();
			} else {
				// console.log('got here somehow');
				//if it does exist, insert user_id and team_id into userTeam table
				const userTeamValues = [user_id, team_id];
				const userTeamQueryString = `INSERT INTO "public"."userTeam" (user_id, team_id)
          VALUES ($1, $2)`;

				db.query(userTeamQueryString, userTeamValues)
					.then((data) => {
						// console.log('in join team query 2');
						//if insert successful, send something on res.locals to frontend
						res.locals.teamAdded = true;
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
