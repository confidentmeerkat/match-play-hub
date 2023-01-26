import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
export default class NotificationController {
  constructor(onNotification: any) {
    this.configure(onNotification);
    this.requestUserPermission();
    this.createDefaultChannels();
    this.createNotificationListeners();
  }

  configure(onNotification: any, gcm = "") {
    PushNotification.configure({
      onRegister: (tokenObject: any) => {},
      onNotification: onNotification,
      senderID: gcm,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    // messaging().setBackgroundMessageHandler(onNotification);
  }

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: "com.matchplayhub", // (required)
        channelName: "com.matchplayhub", // (required)
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created: any) => console.log(`returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  createNotificationListeners() {
    messaging().onMessage(async (remoteMessage: any) => {
      console.log("remoteMessage", JSON.stringify(remoteMessage));
      PushNotification.localNotification({
        channelId: "com.matchplayhub", // (required) channelId, if the channel doesn't exist, notification will not trigger.
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body, // (required)
        userInfo: remoteMessage.data,
      });
    });
  }

  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }
}
