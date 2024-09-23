import type Router from './router';

/** Abstract history management class, you can customize a history for Router class */
export abstract class AbstractHistory {
  router: Router | undefined;

  abstract push(to: string, state: any): boolean;
  abstract replace(to: string, state: any): boolean;
  abstract go(to: number): boolean;

  setRouter(router: Router) {
    this.router = router;
  }
}

/** default history manager */
class History extends AbstractHistory {
  push(to: string, state: any) {
    window.history.pushState(state, '', to);

    return true;
  }

  replace(to: string, state: any) {
    window.history.replaceState(state, '', to);

    return true;
  }

  go(to: number) {
    window.history.go(to);

    return true;
  }
}

export default History;
