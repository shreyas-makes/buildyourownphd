import {
  slugify,
  capitalize,
  truncate,
  chunk,
  unique,
  pick,
  omit,
  formatDate,
  formatBytes,
  clamp,
  isEmail,
  isValidUrl,
} from "../helpers";

describe("String utilities", () => {
  test("slugify converts text to URL-friendly slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("Test   with    spaces")).toBe("test-with-spaces");
    expect(slugify("Special!@#$%Characters")).toBe("specialcharacters");
  });

  test("capitalize converts first letter to uppercase", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("HELLO")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  test("truncate shortens text with suffix", () => {
    expect(truncate("Hello World", 5)).toBe("He...");
    expect(truncate("Hello", 10)).toBe("Hello");
    expect(truncate("Hello World", 8, "...")).toBe("Hello...");
  });
});

describe("Array utilities", () => {
  test("chunk splits array into smaller arrays", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([], 2)).toEqual([]);
  });

  test("unique removes duplicate values", () => {
    expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(unique(["a", "b", "b", "c"])).toEqual(["a", "b", "c"]);
    expect(unique([])).toEqual([]);
  });
});

describe("Object utilities", () => {
  test("pick extracts specified properties", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
    expect(pick(obj, [])).toEqual({});
  });

  test("omit removes specified properties", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 });
    expect(omit(obj, [])).toEqual(obj);
  });
});

describe("Date utilities", () => {
  test("formatDate formats date with custom format", () => {
    const date = new Date("2023-12-25T10:30:00");
    expect(formatDate(date, "YYYY-MM-DD")).toBe("2023-12-25");
    expect(formatDate(date, "DD/MM/YYYY")).toBe("25/12/2023");
  });
});

describe("Number utilities", () => {
  test("formatBytes converts bytes to human readable format", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
  });

  test("clamp constrains value to range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("Validation utilities", () => {
  test("isEmail validates email addresses", () => {
    expect(isEmail("test@example.com")).toBe(true);
    expect(isEmail("invalid-email")).toBe(false);
    expect(isEmail("")).toBe(false);
  });

  test("isValidUrl validates URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
    expect(isValidUrl("invalid-url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });
}); 