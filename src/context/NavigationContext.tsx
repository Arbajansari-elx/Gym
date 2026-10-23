import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PageId } from "../types/navigation";

interface NavigationContextType {
  currentPage: PageId;
  previousPage: PageId | null;
  navigateTo: (page: PageId) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const VALID_PAGES: PageId[] = [
  "home",
  "about",
  "trainer",
  "plans",
  "exercises",
  "muscle-fatloss",
  "coaching",
  "calculator",
  "tracking",
  "gallery",
  "transformations",
  "reviews",
  "membership",
  "contact",
  "admin",
  "attendance",
];

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const resolveTargetPage = useCallback((): PageId => {
    // 1. Check query parameter e.g. ?page=attendance
    try {
      const queryPage = new URLSearchParams(window.location.search).get("page")?.toLowerCase();
      if (queryPage && VALID_PAGES.includes(queryPage as PageId)) {
        return queryPage as PageId;
      }
    } catch {
      // ignore
    }

    // 2. Check path e.g. /attendance or /admin
    try {
      const pathPage = window.location.pathname.replace(/^\/+/, "").split("/")[0].toLowerCase();
      if (pathPage && VALID_PAGES.includes(pathPage as PageId)) {
        return pathPage as PageId;
      }
    } catch {
      // ignore
    }

    // 3. Check hash e.g. #attendance or #admin
    try {
      const raw = window.location.hash.replace(/^#\/?/, "").trim().toLowerCase();
      if (raw && VALID_PAGES.includes(raw as PageId)) {
        return raw as PageId;
      }
    } catch {
      // ignore
    }

    return "home";
  }, []);

  const [currentPage, setCurrentPage] = useState<PageId>(resolveTargetPage);
  const [previousPage, setPreviousPage] = useState<PageId | null>(null);

  useEffect(() => {
    const initialPage = resolveTargetPage();
    if (initialPage !== "home") {
      setCurrentPage(initialPage);
    } else {
      try {
        window.history.replaceState({ page: "home" }, "", window.location.pathname);
      } catch {
        // ignore
      }
    }

    const handleNavigationEvent = () => {
      const statePage = (window.history.state as { page?: PageId } | null)?.page;
      const targetPage = statePage || resolveTargetPage();
      setCurrentPage((prev) => {
        setPreviousPage(prev);
        return targetPage;
      });
      // Ensure page opens at the very top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    window.addEventListener("popstate", handleNavigationEvent);
    window.addEventListener("hashchange", handleNavigationEvent);
    return () => {
      window.removeEventListener("popstate", handleNavigationEvent);
      window.removeEventListener("hashchange", handleNavigationEvent);
    };
  }, []);

  const navigateTo = useCallback((page: PageId) => {
    setCurrentPage((prev) => {
      if (prev === page) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        return prev;
      }
      setPreviousPage(prev);

      const targetPath = page === "home" ? window.location.pathname : `#${page}`;
      try {
        window.history.pushState({ page, fromNav: true }, "", targetPath);
      } catch {
        window.location.hash = page === "home" ? "" : page;
      }

      // Full screen open: Immediately jump to the top so user starts at the very beginning of the page
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return page;
    });
  }, []);

  const goBack = useCallback(() => {
    if (window.history.state?.fromNav && window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo(previousPage || "home");
    }
  }, [navigateTo, previousPage]);

  return (
    <NavigationContext.Provider value={{ currentPage, previousPage, navigateTo, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

