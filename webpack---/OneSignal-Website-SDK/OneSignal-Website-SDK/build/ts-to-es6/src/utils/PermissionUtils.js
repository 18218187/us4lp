import Database from "../services/Database";
import Event from "../Event";
export class PermissionUtils {
  static async triggerNotificationPermissionChanged(updateIfIdentical = false) {
    if (PermissionUtils.executing) {
      return;
    }
    PermissionUtils.executing = true;
    try {
      await PermissionUtils.privateTriggerNotificationPermissionChanged(
        updateIfIdentical
      );
    } finally {
      PermissionUtils.executing = false;
    }
  }
  static async privateTriggerNotificationPermissionChanged(updateIfIdentical) {
    const newPermission = await OneSignal.privateGetNotificationPermission();
    const previousPermission = await Database.get(
      "Options",
      "notificationPermission"
    );
    const shouldBeUpdated =
      newPermission !== previousPermission || updateIfIdentical;
    if (!shouldBeUpdated) {
      return;
    }
    await Database.put("Options", {
      key: "notificationPermission",
      value: newPermission,
    });
    Event.trigger(OneSignal.EVENTS.NATIVE_PROMPT_PERMISSIONCHANGED, {
      to: newPermission,
    });
  }
}
// This flag prevents firing the NATIVE_PROMPT_PERMISSIONCHANGED event twice
// We use multiple APIs:
//    1. Notification.requestPermission callback
//    2. navigator.permissions.query({ name: 'notifications' }`).onchange
// Some browsers support both, while others only support Notification.requestPermission
PermissionUtils.executing = false;
//# sourceMappingURL=PermissionUtils.js.map
