import { Express } from 'express';

export const eventsControllerFactory = (app: Express) => {
	app.post('/events', (req, res) => {
		console.log('Received event:', req.body);

		res.status(200).send({ message: 'Event received' });
	});
};
