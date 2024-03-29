import { TransferFormEntity } from "./transfer-form.model";
import {
  formValidation,
  updateFormValidationSchemaWithBlackList,
} from "./transfer-form.validation";
import * as transferFormApi from "./transfer-form.api";

describe("formValidation - isIBANInBlackList false", () => {
  beforeEach(() => {
    jest.spyOn(transferFormApi, "isIBANInBlackList").mockResolvedValue(false);
  });

  it("should fail when account is empty", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john.doe@gmail.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).toBeDefined();
  });

  it("should not fail when account is informed", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john.doe@gmail.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).not.toBeDefined();
  });
  it("should generate all field errors as required", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "",
      beneficiary: "",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "",
      email: "",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).toBeDefined();
    expect(result["beneficiary"]).toBeDefined();
    expect(result["reference"]).toBeDefined();
    expect(result["email"]).toBeDefined();
  });

  it("should fail when email is not valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john.doe",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["email"]).toBeDefined();
  });

  it("should fail when email is valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john.doe@mail.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["email"]).not.toBeDefined();
  });

  it("should fail when account is not valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB202000000",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "test@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).toBeDefined();
  });

  it("should fail when account is valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).not.toBeDefined();
  });

  it("should fail when integerAmount is not valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 11000,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["integerAmount"]).toBeDefined();
  });

  it("should succeed when integerAmount is valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 1000,
      decimalAmount: 0,
      reference: "Taxes",
      email: "test@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["integerAmount"]).not.toBeDefined();
  });

  it("should fail when decimalAmount is not valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 1000,
      decimalAmount: 100,
      reference: "Taxes",
      email: "test@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["decimalAmount"]).toBeDefined();
  });

  it("should succeed when decimalAmount is valid", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 1000,
      decimalAmount: 99,
      reference: "Taxes",
      email: "test@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["decimalAmount"]).not.toBeDefined();
  });
  it("Should update schema and fail with account france", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "FR7630006000011234567890189",
      beneficiary: "John Doe",
      integerAmount: 1000,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john@email.com",
    };

    // Act
    updateFormValidationSchemaWithBlackList(["FR", "ES"]);

    // Assert
    const result = await formValidation.validateForm(values);
    expect(result["account"]).toBeDefined();
  });

  it("Should update schema and succeed with account not france", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 1000,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john@email.com",
    };

    // Act
    updateFormValidationSchemaWithBlackList(["FR", "ES"]);

    // Assert
    const result = await formValidation.validateForm(values);
    expect(result["account"]).not.toBeDefined();
  });
});

describe("formValidation - isIBanInBlackList true", () => {
  beforeEach(() => {
    jest.spyOn(transferFormApi, "isIBANInBlackList").mockResolvedValue(true);
  });

  it("Should fail when iban is in black list", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 1000,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john@email.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).toBeDefined();
  });
});
