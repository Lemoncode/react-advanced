import { countryBlackList } from "./country-black-list.validator";

describe("countryBlackList validator specs", () => {
  it("should return true when value is undefined", () => {
    // Arrange
    const value = undefined;
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return true when value is null", () => {
    // Arrange
    const value = null;
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return true when value is empty", () => {
    // Arrange
    const value = "";
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return true when value is valid", () => {
    // Arrange
    const value = "GB33BUKB20201555555555";
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return false when value is invalid", () => {
    // Arrange
    const value = "FR7630006000011234567890189";
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeFalsy();
  });
});
