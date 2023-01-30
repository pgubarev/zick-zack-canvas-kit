export function getDocumentWidth(): number {
  return Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
  );
}

export function getDocumentHeight(): number {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
}
