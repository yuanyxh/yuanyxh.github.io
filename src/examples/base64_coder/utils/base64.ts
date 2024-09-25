import { isInteger } from 'lodash-es';

/** base64 字符映射 */
const CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * @description 文本转字节
 * @param str 需要转为字节数组的文本
 * @returns 字节数组
 */
const toBytes = (str: string) => new TextEncoder().encode(str);

/**
 * @description 获取字符串在 base64 字符映射中的索引
 * @param str base64 字符串
 * @returns 字符索引数组
 */
const toCodeAt = (str: string) => {
  const codeAt = [];

  for (let i = 0; i < str.length; i++) {
    const index = CHARACTER_SET.indexOf(str[i]);

    index >= 0 && (codeAt[i] = index);
  }

  return codeAt;
};

/**
 *
 * @param data 需要 base64 编码的数据
 * @returns base64 字符串
 */
const encode = (data: string | ArrayBuffer) => {
  let bytes: Uint8Array;

  if (typeof data === 'string') {
    bytes = toBytes(data);
  } else {
    bytes = new Uint8Array(data);
  }

  const PLACE_CHART = '=';

  let i = 0;
  let output = '';

  while (i < bytes.length) {
    const a = bytes[i++];
    const b = bytes[i++];
    const c = bytes[i++];

    // 3 个 8 位 二进制组合为一个 24 位二进制
    const total = ((a || 0) << 16) + ((b || 0) << 8) + (c || 0);

    output += CHARACTER_SET.charAt(/* 右移 18 位，截取 6 位 */ (total >>> 18) & 0x3f);
    output += CHARACTER_SET.charAt(/* 右移 12 位，截取 6 位 */ (total >>> 12) & 0x3f);
    output += isInteger(b)
      ? CHARACTER_SET.charAt(/* 右移 6 位，截取 6 位 */ (total >>> 6) & 0x3f)
      : PLACE_CHART;
    output += isInteger(c) ? CHARACTER_SET.charAt(/* 截取 6 位 */ total & 0x3f) : PLACE_CHART;
  }

  return output;
};

/**
 *
 * @description 解码 base64 字符串
 * @param str 需要解码的 base64 字符串
 * @returns 解码后的字符串
 */
const decode = (str: string) => {
  const codeAt = toCodeAt(str);

  let i = 0;

  const original = [];

  while (i < codeAt.length) {
    const a = codeAt[i++];
    const b = codeAt[i++];
    const c = codeAt[i++];
    const d = codeAt[i++];

    const n_a = a;
    const n_b = b || 0;
    const n_c = c || 0;
    const n_d = d || 0;

    const total = (n_a << 18) + (n_b << 12) + (n_c << 6) + n_d;

    original.push((total >> 16) & 0xff);
    isInteger(c) && original.push((total >> 8) & 0xff);
    isInteger(d) && original.push(total & 0xff);
  }

  return window.decodeURIComponent(new TextDecoder().decode(new Uint8Array(original)));
};

export default { encode, decode };
