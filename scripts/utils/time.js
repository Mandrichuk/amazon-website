export function getDate() {
  const today = new Date();
  return today.toLocaleDateString('en-US');;
}