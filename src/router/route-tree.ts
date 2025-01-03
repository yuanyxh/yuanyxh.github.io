import type { ResolveRouteObject } from './router';
import { INDEX_PATH, NOT_FOUND_PATH } from './router';

interface Node {
  value: ResolveRouteObject;
  children: Tree;
}

interface Tree {
  [key: string]: Node | null;
}

function split(path: string) {
  return path.split('/').filter(Boolean);
}

/** routes generator tree */
class RouteTree {
  tree: Tree;

  constructor(routes: ResolveRouteObject[]) {
    this.tree = {};

    this.add(this.tree, routes);
  }

  add(root?: Tree, routes?: ResolveRouteObject[]) {
    if (!routes) return;

    root = root || {};

    for (const route of routes) {
      const { path, children } = route;

      if (root[path]) {
        this.add(root[path]!.children, children);
      } else {
        root[path] = {
          value: route,
          children: {}
        };
        this.add(root[path]!.children, children);
      }
    }
  }

  match(path: string): ResolveRouteObject[] {
    if (!path.startsWith('/')) {
      throw new Error('path must start with "/"');
    }

    let node = this.tree;
    let paths: string[] = split(path);

    const pathWithoutFirstSlash = '/' + paths[0];

    if (node[pathWithoutFirstSlash]?.value) {
      paths = [pathWithoutFirstSlash, ...paths.slice(1)];
    } else {
      paths = ['/', ...paths];
    }

    const result: ResolveRouteObject[] = [];
    let i = 0;
    let expectedMatch = paths.length;

    while (paths.length) {
      const key = paths.shift()!;

      if (node[key]?.value) {
        if (!node[key]?.value.element) {
          expectedMatch--;
          node = node[key]!.children;
          continue;
        }

        result[i++] = node[key]!.value;
        node = node[key]!.children;
        continue;
      }

      break;
    }

    if (result.length === expectedMatch) {
      if (node[INDEX_PATH]?.value) {
        result.push(node[INDEX_PATH].value);
      }
    } else {
      result[i] = {
        path: NOT_FOUND_PATH,
        fullPath: Math.random().toString(16)
      };
    }

    return result;
  }
}

export default RouteTree;
