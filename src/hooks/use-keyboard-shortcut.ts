import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    function listener(event: KeyboardEvent) {
      if (event.key === key) {
        handler(event);
      }
    }
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, handler, ...deps]);
}
