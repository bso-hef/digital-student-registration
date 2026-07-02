import {
  CONTACT_PERSON_TYPE_OPTIONS,
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  SALUTATION_OPTIONS,
  SCHOOL_LEVEL_OPTIONS,
  SCHOOL_TYPE_OPTIONS,
} from "@/constants/dropdown.constants";
import { describe, expect, it } from "vitest";

/**
 * Tests for dropdown constants
 * @file tests/unit/constants/dropdown.constants.test.ts
 */

describe("dropdown.constants", () => {
  describe("GENDER_OPTIONS", () => {
    it("should have 3 gender options", () => {
      expect(GENDER_OPTIONS.length).toBe(3);
    });

    it("should include männlich, weiblich, and divers", () => {
      const values = GENDER_OPTIONS.map((opt) => opt.value);
      expect(values).toContain("männlich");
      expect(values).toContain("weiblich");
      expect(values).toContain("divers");
    });

    it("should all be enabled by default", () => {
      GENDER_OPTIONS.forEach((opt) => {
        expect(opt.enabled).toBe(true);
      });
    });

    it("should have proper order", () => {
      expect(GENDER_OPTIONS[0].order).toBe(0);
      expect(GENDER_OPTIONS[1].order).toBe(1);
      expect(GENDER_OPTIONS[2].order).toBe(2);
    });

    it("should have labels", () => {
      GENDER_OPTIONS.forEach((opt) => {
        expect(opt.label).toBeDefined();
        expect(opt.label.length).toBeGreaterThan(0);
      });
    });
  });

  describe("SALUTATION_OPTIONS", () => {
    it("should have 3 salutation options", () => {
      expect(SALUTATION_OPTIONS.length).toBe(3);
    });

    it("should include Herr, Frau, and Divers", () => {
      const values = SALUTATION_OPTIONS.map((opt) => opt.value);
      expect(values).toContain("Herr");
      expect(values).toContain("Frau");
      expect(values).toContain("Divers");
    });

    it("should all be enabled", () => {
      SALUTATION_OPTIONS.forEach((opt) => {
        expect(opt.enabled).toBe(true);
      });
    });
  });

  describe("RELIGION_OPTIONS", () => {
    it("should have 6 religion options", () => {
      expect(RELIGION_OPTIONS.length).toBe(6);
    });

    it("should include major religions and none/other", () => {
      const values = RELIGION_OPTIONS.map((opt) => opt.value);
      expect(values).toContain("katholisch");
      expect(values).toContain("evangelisch");
      expect(values).toContain("islamisch");
      expect(values).toContain("jüdisch");
      expect(values).toContain("keine");
      expect(values).toContain("andere");
    });

    it("should all be enabled", () => {
      RELIGION_OPTIONS.forEach((opt) => {
        expect(opt.enabled).toBe(true);
      });
    });

    it("should have sequential order", () => {
      RELIGION_OPTIONS.forEach((opt, index) => {
        expect(opt.order).toBe(index);
      });
    });
  });

  describe("CONTACT_PERSON_TYPE_OPTIONS", () => {
    it("should have 4 contact person types", () => {
      expect(CONTACT_PERSON_TYPE_OPTIONS.length).toBe(4);
    });

    it("should include Mutter, Vater, Vormund, and Andere", () => {
      const values = CONTACT_PERSON_TYPE_OPTIONS.map((opt) => opt.value);
      expect(values).toContain("Mutter");
      expect(values).toContain("Vater");
      expect(values).toContain("Vormund");
      expect(values).toContain("Andere");
    });

    it("should all be enabled", () => {
      CONTACT_PERSON_TYPE_OPTIONS.forEach((opt) => {
        expect(opt.enabled).toBe(true);
      });
    });
  });

  describe("SCHOOL_LEVEL_OPTIONS", () => {
    it("should have 10 school level options (Klasse 5-14)", () => {
      expect(SCHOOL_LEVEL_OPTIONS.length).toBe(10);
    });

    it("should include all grades from 5 to 14", () => {
      const values = SCHOOL_LEVEL_OPTIONS.map((opt) => opt.value);
      for (let i = 5; i <= 14; i++) {
        expect(values).toContain(`Klasse ${i}`);
      }
    });

    it("should all be enabled", () => {
      SCHOOL_LEVEL_OPTIONS.forEach((opt) => {
        expect(opt.enabled).toBe(true);
      });
    });

    it("should have sequential order starting from 0", () => {
      SCHOOL_LEVEL_OPTIONS.forEach((opt, index) => {
        expect(opt.order).toBe(index);
      });
    });
  });

  describe("SCHOOL_TYPE_OPTIONS", () => {
    it("should have at least 6 school type options", () => {
      expect(SCHOOL_TYPE_OPTIONS.length).toBeGreaterThanOrEqual(6);
    });

    it("should include common German school types", () => {
      const values = SCHOOL_TYPE_OPTIONS.map((opt) => opt.value);
      expect(values).toContain("Grundschule");
      expect(values).toContain("Hauptschule");
      expect(values).toContain("Realschule");
      expect(values).toContain("Gymnasium");
      expect(values).toContain("Gesamtschule");
      expect(values).toContain("Berufsschule");
    });

    it("should all be enabled", () => {
      SCHOOL_TYPE_OPTIONS.forEach((opt) => {
        expect(opt.enabled).toBe(true);
      });
    });

    it("should have proper structure", () => {
      SCHOOL_TYPE_OPTIONS.forEach((opt) => {
        expect(opt).toHaveProperty("value");
        expect(opt).toHaveProperty("label");
        expect(opt).toHaveProperty("enabled");
        expect(opt).toHaveProperty("order");
      });
    });
  });

  describe("DropdownOption structure", () => {
    const allOptions = [
      ...GENDER_OPTIONS,
      ...SALUTATION_OPTIONS,
      ...RELIGION_OPTIONS,
      ...CONTACT_PERSON_TYPE_OPTIONS,
      ...SCHOOL_LEVEL_OPTIONS,
      ...SCHOOL_TYPE_OPTIONS,
    ];

    it("should all have required properties", () => {
      allOptions.forEach((opt) => {
        expect(opt).toHaveProperty("value");
        expect(opt).toHaveProperty("label");
        expect(opt).toHaveProperty("enabled");
        expect(opt).toHaveProperty("order");
      });
    });

    it("should all have string values and labels", () => {
      allOptions.forEach((opt) => {
        expect(typeof opt.value).toBe("string");
        expect(typeof opt.label).toBe("string");
      });
    });

    it("should all have boolean enabled", () => {
      allOptions.forEach((opt) => {
        expect(typeof opt.enabled).toBe("boolean");
      });
    });

    it("should all have number order", () => {
      allOptions.forEach((opt) => {
        expect(typeof opt.order).toBe("number");
      });
    });

    it("should have non-empty values", () => {
      allOptions.forEach((opt) => {
        expect(opt.value.length).toBeGreaterThan(0);
        expect(opt.label.length).toBeGreaterThan(0);
      });
    });

    it("should have non-negative order values", () => {
      allOptions.forEach((opt) => {
        expect(opt.order).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Consistency checks", () => {
    it("should have matching value and label casing patterns", () => {
      // Most options follow pattern: lowercase value, capitalized label
      RELIGION_OPTIONS.forEach((opt) => {
        expect(opt.value).toBe(opt.value.toLowerCase());
        expect(opt.label.charAt(0)).toBe(opt.label.charAt(0).toUpperCase());
      });
    });

    it("should have unique values within each option set", () => {
      const checkUnique = (options: typeof GENDER_OPTIONS) => {
        const values = options.map((opt) => opt.value);
        const uniqueValues = new Set(values);
        expect(uniqueValues.size).toBe(values.length);
      };

      checkUnique(GENDER_OPTIONS);
      checkUnique(SALUTATION_OPTIONS);
      checkUnique(RELIGION_OPTIONS);
      checkUnique(CONTACT_PERSON_TYPE_OPTIONS);
      checkUnique(SCHOOL_LEVEL_OPTIONS);
      checkUnique(SCHOOL_TYPE_OPTIONS);
    });

    it("should have unique orders within each option set", () => {
      const checkUniqueOrder = (options: typeof GENDER_OPTIONS) => {
        const orders = options.map((opt) => opt.order);
        const uniqueOrders = new Set(orders);
        expect(uniqueOrders.size).toBe(orders.length);
      };

      checkUniqueOrder(GENDER_OPTIONS);
      checkUniqueOrder(SALUTATION_OPTIONS);
      checkUniqueOrder(RELIGION_OPTIONS);
      checkUniqueOrder(CONTACT_PERSON_TYPE_OPTIONS);
      checkUniqueOrder(SCHOOL_LEVEL_OPTIONS);
      checkUniqueOrder(SCHOOL_TYPE_OPTIONS);
    });
  });
});
