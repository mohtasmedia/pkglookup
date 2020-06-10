export const d = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
export const b = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
