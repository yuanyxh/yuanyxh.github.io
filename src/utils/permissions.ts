type QueryPermissionName =
  | 'geolocation'
  | 'notifications'
  | 'persistent-storage'
  | 'push'
  | 'screen-wake-lock'
  | 'xr-spatial-tracking';

/**
 *
 * @description Query the permissions of the specified name
 * @param name
 * @returns
 */
export const queryPermissions = async (name: QueryPermissionName) => {
  if (!window.navigator.permissions) {
    return false;
  }

  return (await window.navigator.permissions.query({ name: name })).state;
};

/**
 *
 * @description Check whether permissions are granted
 * @param name
 * @returns
 */
export const hasPermission = async (name: QueryPermissionName) => {
  try {
    const result = await queryPermissions(name);

    return result && result === 'granted';
  } catch (err) {
    return false;
  }
};
