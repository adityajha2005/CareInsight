import * as functions from 'firebase-functions';
import { CloudEvent } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

// Initialize with credentials
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Update the context type to use the correct import
interface AuthContext {
  auth?: {
    uid: string;
    token: admin.auth.DecodedIdToken;
  };
}

export const handleMedicationTaken = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ prescriptionId: string }>) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { prescriptionId } = request.data;
  
    try {
      // Log medication taken
      await admin.firestore()
        .collection('medicationLogs')
        .add({
          prescriptionId,
          userId: request.auth.uid,
          takenAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'taken'
        });

      return { success: true, message: 'Medication logged successfully' };
    } catch (error) {
      console.error('Error logging medication:', error);
      throw new functions.https.HttpsError('internal', 'Failed to log medication');
    }
  }
);

export const snoozeReminder = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ prescriptionId: string }>) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { prescriptionId } = request.data;
    const snoozeMinutes = 5; // Changed from 15 to 5 minutes

    try {
      // Schedule a new reminder
      const newReminder = new Date();
      newReminder.setMinutes(newReminder.getMinutes() + snoozeMinutes);

      await admin.firestore()
        .collection('reminders')
        .add({
          prescriptionId,
          userId: request.auth.uid,
          scheduledFor: admin.firestore.Timestamp.fromDate(newReminder),
          status: 'snoozed'
        });

      return { success: true, nextReminder: newReminder.toISOString() };
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      throw new functions.https.HttpsError('internal', 'Failed to snooze reminder');
    }
  }
);

// PubSub function doesn't need the context type change
export const checkMedicationSchedule = functions.pubsub.onMessagePublished('firebase-schedule-checkMedicationSchedule',
  async (event: CloudEvent<any>) => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    // Update to use exact minutes instead of intervals
    const currentMinute = now.getMinutes().toString().padStart(2, '0');

    try {
      // Get all active prescriptions
      const prescriptionsSnapshot = await admin.firestore()
        .collection('prescriptions')
        .where('active', '==', true)
        .get();

      const notificationPromises = prescriptionsSnapshot.docs.map(async (doc) => {
        const prescription = doc.data();
        const dosageTimes = prescription.dosageTimes || [];

        // Check each dosage time
        return Promise.all(dosageTimes.map(async (time: { hour: string; minute: string }) => {
          // Exact time match instead of interval-based
          if (time.hour === currentHour && time.minute === currentMinute) {
            const userDoc = await admin.firestore()
              .collection('users')
              .doc(prescription.userId)
              .get();

            if (!userDoc.exists) return null;

            const userData = userDoc.data();
            const tokens = userData?.notificationTokens || [];

            if (tokens.length === 0) return null;

            const message = {
              notification: {
                title: 'Time for your medication',
                body: `${prescription.medication} - ${prescription.dosage}`,
              },
              data: {
                prescriptionId: doc.id,
                medication: prescription.medication,
                dosage: prescription.dosage,
                time: `${time.hour}:${time.minute}`,
                click_action: 'OPEN_MEDICATION_DETAILS'
              },
              tokens
            };

            try {
              const response = await admin.messaging().sendEachForMulticast(message);
              console.log(`Sent notifications for ${prescription.medication}:`, response);

              // Clean up invalid tokens
              if (response.failureCount > 0) {
                const invalidTokens = response.responses
                  .map((resp, idx) => !resp.success ? tokens[idx] : null)
                  .filter((token): token is string => token !== null);

                if (invalidTokens.length > 0) {
                  const validTokens = tokens.filter((token: string) => !invalidTokens.includes(token));
                  await userDoc.ref.update({ notificationTokens: validTokens });
                }
              }

              return response;
            } catch (error) {
              console.error(`Error sending notification for ${prescription.medication}:`, error);
              return null;
            }
          }
          return null;
        }));
      });

      await Promise.all(notificationPromises);
      return null;
    } catch (error) {
      console.error('Error in medication schedule check:', error);
      return null;
    }
  });
