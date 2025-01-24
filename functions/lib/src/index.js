"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMedicationSchedule = exports.snoozeReminder = exports.handleMedicationTaken = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize with credentials
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    }),
});
// Remove unused interface
// Instead, use string type directly for tokens
exports.handleMedicationTaken = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }
    const { prescriptionId } = data;
    try {
        // Log medication taken
        await admin.firestore()
            .collection('medicationLogs')
            .add({
            prescriptionId,
            userId: context.auth.uid,
            takenAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'taken'
        });
        return { success: true, message: 'Medication logged successfully' };
    }
    catch (error) {
        console.error('Error logging medication:', error);
        throw new functions.https.HttpsError('internal', 'Failed to log medication');
    }
});
exports.snoozeReminder = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }
    const { prescriptionId } = data;
    const snoozeMinutes = 15;
    try {
        // Schedule a new reminder
        const newReminder = new Date();
        newReminder.setMinutes(newReminder.getMinutes() + snoozeMinutes);
        await admin.firestore()
            .collection('reminders')
            .add({
            prescriptionId,
            userId: context.auth.uid,
            scheduledFor: admin.firestore.Timestamp.fromDate(newReminder),
            status: 'snoozed'
        });
        return { success: true, nextReminder: newReminder.toISOString() };
    }
    catch (error) {
        console.error('Error snoozing reminder:', error);
        throw new functions.https.HttpsError('internal', 'Failed to snooze reminder');
    }
});
exports.checkMedicationSchedule = functions.pubsub
    .schedule('every 5 minutes')
    .timeZone('UTC')
    .onRun(async (context) => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = Math.floor(now.getMinutes() / 15) * 15;
    const currentMinuteStr = currentMinute.toString().padStart(2, '0');
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
            return Promise.all(dosageTimes.map(async (time) => {
                if (time.hour === currentHour && time.minute === currentMinuteStr) {
                    const userDoc = await admin.firestore()
                        .collection('users')
                        .doc(prescription.userId)
                        .get();
                    if (!userDoc.exists)
                        return null;
                    const userData = userDoc.data();
                    const tokens = (userData === null || userData === void 0 ? void 0 : userData.notificationTokens) || [];
                    if (tokens.length === 0)
                        return null;
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
                        const response = await admin.messaging().sendMulticast(message);
                        console.log(`Sent notifications for ${prescription.medication}:`, response);
                        // Clean up invalid tokens
                        if (response.failureCount > 0) {
                            // Type the tokens directly as string[]
                            const invalidTokens = response.responses
                                .map((resp, idx) => !resp.success ? tokens[idx] : null)
                                .filter((token) => token !== null);
                            if (invalidTokens.length > 0) {
                                const validTokens = tokens.filter((token) => !invalidTokens.includes(token));
                                await userDoc.ref.update({ notificationTokens: validTokens });
                            }
                        }
                        return response;
                    }
                    catch (error) {
                        console.error(`Error sending notification for ${prescription.medication}:`, error);
                        return null;
                    }
                }
                return null;
            }));
        });
        await Promise.all(notificationPromises);
        return null;
    }
    catch (error) {
        console.error('Error in medication schedule check:', error);
        return null;
    }
});
//# sourceMappingURL=index.js.map