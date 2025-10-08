import aedes from 'aedes';
import { createServer } from 'net';
import http from 'http';
import ws from 'websocket-stream';
import admin from 'firebase-admin';
import {
	PROJECT_ID,
	PRIVATE_KEY,
	CLIENT_EMAIL,
	TYPE,
	PRIVATE_KEY_ID,
	CLIENT_ID,
	AUTH_URI,
	TOKEN_URI,
	AUTH_PROVIDER_CERT_URL,
	CLIENT_CERT_URL,
	UNIVERSE_DOMAIN,
	DATABASE_URL
} from './lib/variables.js';

const aedesInstance = new aedes();
const server = createServer(aedesInstance.handle);
const httpServer = http.createServer();

// Initialize Firebase Admin

const serviceAccount = {
	type: TYPE,
	project_id: PROJECT_ID,
	private_key_id: PRIVATE_KEY_ID,
	private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: CLIENT_EMAIL,
	client_id: CLIENT_ID,
	auth_uri: AUTH_URI,
	token_uri: TOKEN_URI,
	auth_provider_x509_cert_url: AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: CLIENT_CERT_URL,
	universe_domain: UNIVERSE_DOMAIN
} as any

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: DATABASE_URL
});

const db = admin.database();

// MQTT over TCP
server.listen(1883, function() {
	console.log('MQTT Broker (TCP) started on port 1883');
});

// MQTT over WebSocket
// @ts-ignore
ws.createServer({ server: httpServer }, aedesInstance.handle);
httpServer.listen(process.env.PORT || 8080, function() {
	console.log('MQTT Broker (WebSocket) started on port', process.env.PORT || 8080);
});

// Store published messages in Firebase
aedesInstance.on('publish', async function(packet, client) {
	console.log("Publishing...", packet.payload.toString());

	if (client) {
		try {
			const topic = packet.topic;
			const payload = packet.payload.toString();

			// Handle location data differently - store by userId to avoid duplication
			if (topic.startsWith('location/user/')) {
				const userId = topic.split('/')[2];
				const locationData = JSON.parse(payload);

				// Store/update the latest location for this user
				await db.ref(`locations/${userId}`).set({
					...locationData,
					updatedAt: admin.database.ServerValue.TIMESTAMP
				});

				console.log(`Updated location for user: ${userId}`);
			}
			// Keep other messages in the messages collection (like switch states)
			else {
				await db.ref('messages').push({
					clientId: client.id,
					topic: topic,
					payload: payload,
					timestamp: admin.database.ServerValue.TIMESTAMP
				});

				console.log(`Stored message for topic: ${topic}`);
			}
		} catch (error) {
			console.error('Error storing message:', error);
		}
	}
});
