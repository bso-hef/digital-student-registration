import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;

    if (title) {
      document.title = title;
    }

    return () => {
      if (document.title === title) {
        document.title = previousTitle;
      }
    };
  }, [title]);
}
