import { Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";
import { iban } from "@lemoncode/fonk-iban-validator";
import { rangeNumber } from "@lemoncode/fonk-range-number-validator";
import { countryBlackList } from "./custom-validators";
import { ibanBlackList } from "./custom-validators/iban-black-list.validator";
import { switzerlandTransfer } from "./custom-validators/swiss-limit.record-validator";

const validationSchema = {
  field: {
    account: [Validators.required, iban.validator, ibanBlackList],
    beneficiary: [Validators.required],
    name: [Validators.required],
    integerAmount: [
      Validators.required,
      {
        validator: rangeNumber,
        customArgs: {
          min: {
            value: 0,
            inclusive: true,
          },
          max: {
            value: 10000,
            inclusive: true,
          },
        },
      },
    ],
    decimalAmount: [
      Validators.required,
      {
        validator: rangeNumber,
        customArgs: {
          min: {
            value: 0,
            inclusive: true,
          },
          max: {
            value: 99,
            inclusive: true,
          },
        },
      },
    ],
    reference: [Validators.required],
    email: [Validators.required, , Validators.email],
  },
  record: {
    switzerlandTransfer: [switzerlandTransfer],
  },
};

export const formValidation = createFormikValidation(validationSchema);

export const updateFormValidationSchemaWithBlackList = (
  countries: string[]
) => {
  const newValidationSchema = {
    ...validationSchema,
    field: {
      ...validationSchema.field,
      account: [
        ...validationSchema.field.account,
        {
          validator: countryBlackList,
          customArgs: {
            countries,
          },
        },
      ],
    },
  };
  formValidation.updateValidationSchema(newValidationSchema);
};
