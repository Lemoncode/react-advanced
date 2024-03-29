import React from "react";
import { Formik, Form } from "formik";
import { InputFormik } from "../common";
import {
  TransferFormEntity,
  createEmptyTransferFormEntity,
} from "./transfer-form.model";
import classes from "./transfer-form.component.css";
import {
  formValidation,
  updateFormValidationSchemaWithBlackList,
} from "./transfer-form.validation";
import { getDisabledCountryIBANCollection } from "./transfer-form.api";

export const TransferForm: React.FC = () => {
  React.useEffect(() => {
    getDisabledCountryIBANCollection().then((countries) => {
      updateFormValidationSchemaWithBlackList(countries);
    });
  }, []);

  return (
    <>
      <h1>Transfer From</h1>
      <Formik
        initialValues={createEmptyTransferFormEntity()}
        onSubmit={(values) => {
          console.log(values);
        }}
        validate={(values) => formValidation.validateForm(values)}
      >
        {({ errors }) => (
          <Form>
            <div className={classes.formGroup}>
              <label htmlFor="account">Beneficiary IBAN</label>
              <InputFormik id="account" name="account" />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="beneficiary">Beneficiary fullname: </label>
              <InputFormik id="beneficiary" name="beneficiary" />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="amount">Amount of wire</label>
              <div className={classes.amountFields}>
                <InputFormik id="integerAmount" name="integerAmount" />
                <div>.</div>
                <InputFormik id="decimalAmount" name="decimalAmount" />
              </div>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="reference">Reference</label>
              <InputFormik id="reference" name="reference" />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email">Email</label>
              <InputFormik id="email" name="email" />
            </div>
            <div>
              {errors["recordErrors"] &&
                errors["recordErrors"].switzerlandTransfer && (
                  <span style={{ color: "red" }}>
                    {errors["recordErrors"].switzerlandTransfer}
                  </span>
                )}
            </div>
            <div className={classes.buttons}>
              <button type="submit">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
