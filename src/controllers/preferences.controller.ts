import { Express } from 'express';

export const preferencesControllerFactory = (app: Express) => {
	app.get('/preferences/:userId', (req, res) => {
		console.log(`Preferences for user ${req.params.userId} requested`);

		res.status(200).send({ message: 'Hello!' });
	});

	app.post('/preferences/:userId', (req, res) => {
		console.log(`Preferences for user ${req.params.userId} updated`, req.body);

		res.status(200).send({ message: 'Hello!' });
	});
};
