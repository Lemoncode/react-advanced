import { Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";
import { iban } from "@lemoncode/fonk-iban-validator";
import { rangeNumber } from "@lemoncode/fonk-range-number-validator";

const validationSchema = {
  field: {
    account: [
      Validators.required,
      iban.validator,
      {
        validator: Validators.pattern,
        customArgs: {
          pattern: /^(?!FR)/i,
        },
        message: "Transfers to France temporary disabled",
      },
    ],
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
};

export const formValidation = createFormikValidation(validationSchema);
