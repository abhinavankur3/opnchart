const capitalize = (str) => {
  const s = String(str);
  return s.charAt(0).toUpperCase() + s.slice(1);
};
export default capitalize;
