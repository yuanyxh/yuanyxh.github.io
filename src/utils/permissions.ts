type QueryPermissionName =
  | 'geolocation'
  | 'notifications'
  | 'persistent-storage'
  | 'push'
  | 'screen-wake-lock'
  | 'xr-spatial-tracking';

export const queryPermissions = async (name: QueryPermissionName) => {
  if (!window.navigator.permissions) {
    return false;
  }

  return (await window.navigator.permissions.query({ name: name })).state;
};

export const hasPermission = async (name: QueryPermissionName) => {
  try {
    const result = await queryPermissions(name);

    return result && result === 'granted';
  } catch (err) {
    return false;
  }
};
