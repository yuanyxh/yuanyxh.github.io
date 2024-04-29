export const isSupportOPFS = async () => {
  if (!window.navigator.storage?.getDirectory) {
    return false;
  }

  return window.navigator.storage
    .getDirectory()
    .then(() => true)
    .catch(() => false);
};
