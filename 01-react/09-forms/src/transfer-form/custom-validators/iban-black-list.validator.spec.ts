import * as transferFormApi from "../transfer-form.api";
import { ibanBlackList } from "./iban-black-list.validator";

describe("ibanBlackList", () => {
  it("Should fail with black list", async () => {
    // Arrange
    const value = "BE71 0961 2345 6769";

    jest.spyOn(transferFormApi, "isIBANInBlackList").mockResolvedValue(true);

    // Act
    const result = await ibanBlackList({ value });

    // Assert
    expect(result.succeeded).toBeFalsy();
    expect(result.message).toEqual("This IBAN is not allowed");
  });

  it("Should return empty message if iban is not in black list", async () => {
    // Arrange
    const value = "BE71 0961 2345 6769";

    jest.spyOn(transferFormApi, "isIBANInBlackList").mockResolvedValue(false);

    // Act
    const result = await ibanBlackList({ value });

    // Assert
    expect(result.succeeded).toBeTruthy();
    expect(result.message).toEqual("");
  });
});
