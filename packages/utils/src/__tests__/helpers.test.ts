import { slugify, capitalize, formatBytes, isEmail } from "../helpers";

describe("Helper Functions", () => {
  describe("slugify", () => {
    it("should convert text to slug", () => {
      expect(slugify("Hello World!")).toBe("hello-world");
      expect(slugify("  Special@Characters#  ")).toBe("specialcharacters");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
    });
  });

  describe("formatBytes", () => {
    it("should format bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
    });
  });

  describe("isEmail", () => {
    it("should validate email addresses", () => {
      expect(isEmail("test@example.com")).toBe(true);
      expect(isEmail("invalid-email")).toBe(false);
      expect(isEmail("")).toBe(false);
    });
  });
}); 