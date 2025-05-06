/**
 * local storage 저장
 * @param key
 * @param value
 */
export const setLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * local storage 가져오기
 * @param key
 * @returns
 */
export const getLocalStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch (error) {
    console.error(error);

    return null;
  }
};

/**
 * local storage 삭제
 * @param key
 */
export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
