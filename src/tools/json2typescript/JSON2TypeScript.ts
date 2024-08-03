import { isArray, isBoolean, isNull, isNumber, isObject, isString, upperFirst } from 'lodash-es';

type type = 'string' | 'number' | 'boolean' | 'null' | Record<string, Type> | Type[];

type Type = {
  type: type;
  require: boolean;
};

const createStringType = (): Type => {
  return { type: 'string', require: true };
};

const createNumberType = (): Type => {
  return { type: 'number', require: true };
};

const createBooleanType = (): Type => {
  return { type: 'boolean', require: true };
};

const createNullType = (): Type => {
  return { type: 'null', require: true };
};

const createObjectType = (data: Record<string, any>): Type => {
  const keys = Object.keys(data);

  const companion: Record<string, Type> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    companion[key] = createType(data[key]);
  }

  return { type: companion, require: true };
};

const createArrayType = (data: any[]): Type => {
  const companion: Type[] = [];

  for (let i = 0; i < data.length; i++) {
    const curr = data[i];

    companion.push(createType(curr));
  }

  return { type: companion, require: true };
};

export function createType(data: any) {
  let type!: Type;

  switch (true) {
    case isString(data):
      type = createStringType();
      break;
    case isNumber(data):
      type = createNumberType();
      break;
    case isNull(data):
      type = createNullType();
      break;
    case isBoolean(data):
      type = createBooleanType();
      break;
    case isArray(data):
      type = createArrayType(data);
      break;
    case isObject(data):
      type = createObjectType(data);
      break;
  }

  return type;
}

export function generate(tree: Type) {
  const typeStr: string[] = [];

  const names = new Map<string, number>();

  const generateString = () => 'string;\n';
  const generateNumber = () => 'number;\n';
  const generateBoolean = () => 'boolean;\n';
  const generateNull = () => 'null;\n';

  function getName(key: string) {
    let typeName = key;

    if (!Number.isNaN(window.parseInt(typeName))) {
      const name = 'N' + typeName;

      let count = names.get(name);

      if (typeof count === 'number') {
        typeName = name.padStart(name.length + ++count, 'N');

        names.set(name, count);
      } else {
        typeName = name;

        names.set(name, 0);
      }
    } else {
      let count = names.get(typeName);

      if (typeof count === 'number') {
        count++;

        typeName += count;

        names.set(typeName, count);
      } else {
        names.set(typeName, 0);
      }
    }

    typeName = upperFirst(typeName);

    return typeName;
  }

  function generateObject(data: Record<string, Type>, name?: string) {
    let type = '{\n';

    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof typeof data;
      const prop = data[key];

      const typeName = getName(key);

      switch (prop.type) {
        case 'string':
          type += `  ${key}: ${generateString()}`;
          break;
        case 'number':
          type += `  ${key}: ${generateNumber()}`;
          break;
        case 'null':
          type += `  ${key}: ${generateNull()}`;
          break;
        case 'boolean':
          type += `  ${key}: ${generateBoolean()}`;
          break;
        default:
          if (isArray(prop.type)) {
            generateArray(prop.type, typeName);

            type += `  ${key}: ${typeName};\n`;
          } else if (isObject(prop.type)) {
            generateObject(prop.type, typeName);

            type += `  ${key}: ${typeName};\n`;
          }
      }
    }

    if (!name) {
      return typeStr.push(`export interface Root ${type}}`);
    }

    typeStr.push(`export interface ${name} ${type}}`);
  }

  function generateArray(data: Type[], name?: string) {
    let type = '';

    if (data.length === 0) {
      type += 'any[];\n';
    } else if (data.every((e) => e.type === 'string')) {
      type += 'string[];\n';
    } else if (data.every((e) => e.type === 'number')) {
      type += 'string[];\n';
    } else if (data.every((e) => e.type === 'boolean')) {
      type += 'boolean[];\n';
    } else if (data.every((e) => e.type === 'null')) {
      type += 'null[];\n';
    } else {
      // for (let i = 0; i < data.length; i++) {
      //   const element = data[i];
      // }
    }

    if (!name) {
      return `export type Root = ` + type;
    }

    typeStr.push(`type ${name} = ${type}[];\n`);
  }

  if (isArray(tree.type)) {
    generateArray(tree.type);
  } else if (isObject(tree.type)) {
    generateObject(tree.type);
  }

  return typeStr.reverse().join('\n\n');
}
