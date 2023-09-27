import { switzerlandTransfer } from "./swiss-limit.record-validator";

describe("switzerlandTransfer", () => {
  it("Should return empty message if iban is not in switzerland", () => {
    // Arrange
    const values = {
      account: "BE71 0961 2345 6769",
      integerAmount: 1000,
      decimalAmount: 0,
    };

    // Act
    const result = switzerlandTransfer({ values });

    // Assert
    expect(result.succeeded).toBeTruthy();
    expect(result.message).toEqual("");
  });

  it("Should return empty message if iban is in switzerland and amount is less than 1000", () => {
    // Arrange
    const values = {
      account: "CH93 0076 2011 6238 5295 7",
      integerAmount: 999,
      decimalAmount: 99,
    };

    // Act
    const result = switzerlandTransfer({ values });

    // Assert
    expect(result.succeeded).toBeTruthy();
    expect(result.message).toEqual("");
  });

  it("Should return empty message if iban is in switzerland and amount is 1000", () => {
    // Arrange
    const values = {
      account: "CH93 0076 2011 6238 5295 7",
      integerAmount: 1000,
      decimalAmount: 0,
    };

    // Act
    const result = switzerlandTransfer({ values });

    // Assert
    expect(result.succeeded).toBeTruthy();
    expect(result.message).toEqual("");
  });

  it("Should return error message if iban is in switzerland and amount is 1000.01", () => {
    // Arrange
    const values = {
      account: "CH93 0076 2011 6238 5295 7",
      integerAmount: 1000,
      decimalAmount: 1,
    };

    // Act
    const result = switzerlandTransfer({ values });

    // Assert
    expect(result.succeeded).toBeFalsy();
    expect(result.message).toEqual(
      "Not allowed to transfer more than 1000 € in Swiss account"
    );
  });
});
