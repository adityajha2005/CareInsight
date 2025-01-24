'use client';
import { useEffect, useState, useRef } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db, app } from './firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { getAuth, signInAnonymously } from 'firebase/auth';

const isMobile = () => {
  if (typeof window !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
};

export function NotificationHandler() {
  const { user } = useUser();
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isInitializing, setIsInitializing] = useState(true);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio only on client side
    notificationSound.current = new Audio('/notification-sound.mp3');
  }, []);

  const requestAndInitializeNotifications = async () => {
    if (!('Notification' in window) && !isMobile()) {
      console.log('Notifications not supported');
      return;
    }

    try {
      // For mobile devices, we don't need to request permission as it's handled by the OS
      if (!isMobile()) {
        const permission = await window.Notification.requestPermission();
        setPermissionState(permission);
      }

      if ((isMobile() || permissionState === 'granted') && user) {
        const auth = getAuth(app);
        
        // Ensure we're authenticated with Firebase
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }

        // Check if user is authenticated
        if (!auth.currentUser) {
          console.log('User must be authenticated for notifications');
          return;
        }

        // Check if browser is online
        if (!navigator.onLine) {
          console.log('Browser is offline, notifications may not work');
          return;
        }

        // Initialize messaging only after confirming auth
        const messaging = getMessaging(app);
        
        // Ensure service worker is registered
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
          });

          if (token) {
            await setDoc(
              doc(db, 'users', user.id),
              {
                notificationTokens: arrayUnion(token),
                email: user.emailAddresses[0].emailAddress,
                deviceType: isMobile() ? 'mobile' : 'web',
                platform: navigator.platform
              },
              { merge: true }
            );
          }
        }
      }
    } catch (error: any) {
      console.error('Notification setup error:', error?.message || error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Check current permission state
    if ('Notification' in window) {
      console.log('Current permission state:', Notification.permission);
      setPermissionState(Notification.permission);
    }

    requestAndInitializeNotifications();

    // Add message listener
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      
      if (isMobile()) {
        // On mobile, Firebase handles the notification display automatically
        return;
      }

      // Play notification sound using the ref
      notificationSound.current?.play().catch(err => console.log('Error playing sound:', err));

      // Create desktop notification with enhanced options
      const notification = new Notification(payload.notification?.title || 'New Message', {
        body: payload.notification?.body,
        icon: '/logo.png',
        badge: '/logo.png',
        // vibration: [200, 100, 200],
        requireInteraction: true, // Notification will stay until user interacts
        silent: false, // Allow system sound
        tag: 'medication-reminder', // Group similar notifications
        data: payload.data // Store additional data
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus(); // Focus the browser window
        notification.close();
        // Navigate to specific page if needed
        // window.location.href = '/medications';
      };
    });

    return () => {
      setIsInitializing(true);
      unsubscribe();  // Cleanup message listener
    };
  }, [user]);

  // Only show the permission UI for web browsers, not mobile
  if (permissionState === 'denied' && !isMobile()) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 p-4 rounded-lg shadow-lg border border-red-200">
        <p className="text-red-700">
          Notifications are blocked. Please enable notifications in your browser settings to receive medication reminders.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              // Reset permission state and try again
              setPermissionState('default');
              requestAndInitializeNotifications();
            }}
          >
            Retry Permission
          </button>
          <button
            className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
            onClick={() => {
              if (navigator.userAgent.toLowerCase().includes('chrome')) {
                window.open('chrome://settings/content/notifications');
              } else if (navigator.userAgent.toLowerCase().includes('firefox')) {
                window.open('about:preferences#privacy');
              } else {
                window.open('about:settings');
              }
            }}
          >
            Browser Settings
          </button>
        </div>
      </div>
    );
  }

  return null;
}
