import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({ label, name, formik, show, setShow, placeholder }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
        {label}
      </label>
      <div className="input-group">
        <input
          type={show ? "text" : "password"}
          name={name}
          className={`form-control ${formik.touched[name] && formik.errors[name] ? "is-invalid" : ""}`}
          placeholder={placeholder || ""}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{ fontSize: "14px" }}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
        {formik.touched[name] && formik.errors[name] && (
          <div className="invalid-feedback">{formik.errors[name]}</div>
        )}
      </div>
    </div>
  );
};

export default PasswordField;
