"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMedicationSchedule = exports.snoozeReminder = exports.handleMedicationTaken = void 0;
var functions = require("firebase-functions");
var admin = require("firebase-admin");
// Initialize with credentials
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    }),
});
exports.handleMedicationTaken = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var prescriptionId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!context.auth) {
                    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
                }
                prescriptionId = data.prescriptionId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Log medication taken
                return [4 /*yield*/, admin.firestore()
                        .collection('medicationLogs')
                        .add({
                        prescriptionId: prescriptionId,
                        userId: context.auth.uid,
                        takenAt: admin.firestore.FieldValue.serverTimestamp(),
                        status: 'taken'
                    })];
            case 2:
                // Log medication taken
                _a.sent();
                return [2 /*return*/, { success: true, message: 'Medication logged successfully' }];
            case 3:
                error_1 = _a.sent();
                console.error('Error logging medication:', error_1);
                throw new functions.https.HttpsError('internal', 'Failed to log medication');
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.snoozeReminder = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var prescriptionId, snoozeMinutes, newReminder, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!context.auth) {
                    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
                }
                prescriptionId = data.prescriptionId;
                snoozeMinutes = 15;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                newReminder = new Date();
                newReminder.setMinutes(newReminder.getMinutes() + snoozeMinutes);
                return [4 /*yield*/, admin.firestore()
                        .collection('reminders')
                        .add({
                        prescriptionId: prescriptionId,
                        userId: context.auth.uid,
                        scheduledFor: admin.firestore.Timestamp.fromDate(newReminder),
                        status: 'snoozed'
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, { success: true, nextReminder: newReminder.toISOString() }];
            case 3:
                error_2 = _a.sent();
                console.error('Error snoozing reminder:', error_2);
                throw new functions.https.HttpsError('internal', 'Failed to snooze reminder');
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.checkMedicationSchedule = functions.pubsub
    .schedule('every 5 minutes')
    .timeZone('UTC')
    .onRun(function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var now, currentHour, currentMinute, currentMinuteStr, prescriptionsSnapshot, notificationPromises, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = new Date();
                currentHour = now.getHours().toString().padStart(2, '0');
                currentMinute = Math.floor(now.getMinutes() / 15) * 15;
                currentMinuteStr = currentMinute.toString().padStart(2, '0');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, admin.firestore()
                        .collection('prescriptions')
                        .where('active', '==', true)
                        .get()];
            case 2:
                prescriptionsSnapshot = _a.sent();
                notificationPromises = prescriptionsSnapshot.docs.map(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                    var prescription, dosageTimes;
                    return __generator(this, function (_a) {
                        prescription = doc.data();
                        dosageTimes = prescription.dosageTimes || [];
                        // Check each dosage time
                        return [2 /*return*/, Promise.all(dosageTimes.map(function (time) { return __awaiter(void 0, void 0, void 0, function () {
                                var userDoc, userData, tokens_1, message, response, invalidTokens_1, validTokens, error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(time.hour === currentHour && time.minute === currentMinuteStr)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, admin.firestore()
                                                    .collection('users')
                                                    .doc(prescription.userId)
                                                    .get()];
                                        case 1:
                                            userDoc = _a.sent();
                                            if (!userDoc.exists)
                                                return [2 /*return*/, null];
                                            userData = userDoc.data();
                                            tokens_1 = (userData === null || userData === void 0 ? void 0 : userData.notificationTokens) || [];
                                            if (tokens_1.length === 0)
                                                return [2 /*return*/, null];
                                            message = {
                                                notification: {
                                                    title: 'Time for your medication',
                                                    body: "".concat(prescription.medication, " - ").concat(prescription.dosage),
                                                },
                                                data: {
                                                    prescriptionId: doc.id,
                                                    medication: prescription.medication,
                                                    dosage: prescription.dosage,
                                                    time: "".concat(time.hour, ":").concat(time.minute),
                                                    click_action: 'OPEN_MEDICATION_DETAILS'
                                                },
                                                tokens: tokens_1
                                            };
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 6, , 7]);
                                            return [4 /*yield*/, admin.messaging().sendMulticast(message)];
                                        case 3:
                                            response = _a.sent();
                                            console.log("Sent notifications for ".concat(prescription.medication, ":"), response);
                                            if (!(response.failureCount > 0)) return [3 /*break*/, 5];
                                            invalidTokens_1 = response.responses
                                                .map(function (resp, idx) { return !resp.success ? tokens_1[idx] : null; })
                                                .filter(Boolean);
                                            if (!(invalidTokens_1.length > 0)) return [3 /*break*/, 5];
                                            validTokens = tokens_1.filter(function (token) { return !invalidTokens_1.includes(token); });
                                            return [4 /*yield*/, userDoc.ref.update({ notificationTokens: validTokens })];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5: return [2 /*return*/, response];
                                        case 6:
                                            error_4 = _a.sent();
                                            console.error("Error sending notification for ".concat(prescription.medication, ":"), error_4);
                                            return [2 /*return*/, null];
                                        case 7: return [2 /*return*/, null];
                                    }
                                });
                            }); }))];
                    });
                }); });
                return [4 /*yield*/, Promise.all(notificationPromises)];
            case 3:
                _a.sent();
                return [2 /*return*/, null];
            case 4:
                error_3 = _a.sent();
                console.error('Error in medication schedule check:', error_3);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); });
