export function formatTime(time: string) {
  // @ts-ignore
  return new Date(time.replace(/[\-TZ]/g, function(a, b) {
    switch (a) {
      case '-':
        return '/';
      case 'T':
        return ' ';
      case 'Z':
        return '';
    }
  })).getTime();
}
