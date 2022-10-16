import { Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";

const validationSchema = {
  field: {
    account: [Validators.required],
    beneficiary: [Validators.required],
    name: [Validators.required],
    integerAmount: [Validators.required],
    decimalAmount: [Validators.required],
    reference: [Validators.required],
    email: [Validators.required],
  },
};

export const formValidation = createFormikValidation(validationSchema);
