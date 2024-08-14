import { isArray, isNull, isObject } from 'lodash-es';

type BaseType = 'string' | 'number' | 'boolean' | 'null' | 'any' | JointType;

type JointType = Record<string, Type>;

type Type = {
  type: BaseType;
  required: boolean;
  count?: number;
};

const createStringType = (): Type => {
  return { type: 'string', required: true };
};

const createNumberType = (): Type => {
  return { type: 'number', required: true };
};

const createBooleanType = (): Type => {
  return { type: 'boolean', required: true };
};

const createNullType = (): Type => {
  return { type: 'null', required: true };
};

/**
 *
 * @param obj 需要检索类型的对象
 * @param sibling 可选的同级类型
 * @returns 返回对象类型
 */
function createObjectType(obj: Record<string, any>, sibling?: BaseType): Type {
  // 如果有同级类型，且同级类型不是对象，则返回 any
  if (sibling && (typeof sibling === 'string' || isArray(sibling))) {
    return { type: 'any', required: true };
  }

  const names = Object.getOwnPropertyNames(obj);
  const oldNames = sibling ? Object.getOwnPropertyNames(sibling) : [];

  const typeObj: JointType = sibling || {};

  const merge = (t: Type, name: string) => {
    // 没有同级类型，不做特殊处理
    if (!sibling) {
      return (typeObj[name] = t);
    }

    // 存在同级类型，但没有相同属性，标记为可选
    const oldType = typeObj[name];
    if (!oldType) {
      t.required = false;
      return (typeObj[name] = t);
    }

    // 类型不一致，标记为 any
    if (oldType.type !== t.type) {
      oldType.type = 'any';
    }
  };

  for (let i = 0; i < names.length; i++) {
    const name = names[i];

    const value = obj[name];
    const type = typeof value;

    switch (type) {
      case 'string':
        merge(createStringType(), name);
        break;
      case 'number':
        merge(createNumberType(), name);
        break;
      case 'boolean':
        merge(createBooleanType(), name);
        break;
      default:
        if (isNull(value)) {
          merge(createNullType(), name);
        } else if (isArray(value)) {
          merge(createArrayType(value), name);
        } else if (isObject(value)) {
          // 如果存在同级元素，将它向下传递
          merge(createObjectType(value, typeObj[name]?.type), name);
        }
    }
  }

  // obj 中如果没有 sibling 的属性，需要标记为可选
  oldNames
    .filter((o) => !names.includes(o))
    .forEach((o) => {
      typeObj[o].required = false;
    });

  return { type: typeObj, required: true };
}

function createArrayType(array: any[]): Type {
  let type!: Type;

  for (let i = 0; i < array.length; i++) {
    const ele = array[i];

    const eleType = typeof ele;

    switch (eleType) {
      case 'string':
        createStringType();
        break;
      case 'number':
        createNumberType();
        break;
      case 'boolean':
        createBooleanType();
        break;
      default:
        if (isNull(ele)) {
          createNullType();
        } else if (isArray(ele)) {
          createArrayType(ele);
        } else if (isObject(ele)) {
          createObjectType(ele);
        }
    }
  }

  return type;
}

export function transform(json: Record<string, any> | any[]) {
  if (isArray(json)) {
    return createArrayType(json);
  } else if (isObject(json)) {
    return createObjectType(json);
  }

  throw new Error('Invail type of the json.');
}

export const getTag = (count: number) => {
  return '[]'.repeat(count);
};

export function json2ts(json: Record<string, any> | any[]) {
  const tree = transform(json);

  console.log(tree);

  return '';
}
