type EventEmitterListener = (...anys: any[]) => any;

/**
 *
 * @description global event emitter
 */
class EventEmitter {
  listeners: Map<string, EventEmitterListener[]> = new Map();

  on<K extends (...anys: any[]) => any>(key: string, fn: K) {
    let listeners: EventEmitterListener[] = [];
    if (this.listeners.has(key)) {
      listeners = this.listeners.get(key)!;
    }

    this.listeners.set(key, [...listeners, fn]);

    return () => this.off(key, fn);
  }

  off<K extends (...anys: any[]) => any>(key: string, fn: K) {
    if (this.listeners.has(key)) {
      const listeners = this.listeners.get(key)!;

      this.listeners.set(
        key,
        listeners.filter((listener) => listener !== fn)
      );
    }
  }

  emit(key: string, ...data: any[]) {
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.forEach((fn) => fn(...data));

      return true;
    }

    return false;
  }

  has(type: string) {
    return this.listeners.has(type) && this.listeners.get(type)?.length;
  }
}

export default EventEmitter;
