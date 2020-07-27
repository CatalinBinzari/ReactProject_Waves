import React from 'react';


const Formfield = ({ formdata, change, id }) => {
    const showError = () => {
        let errorMessage = null;

        if (formdata.validation && !formdata.value) {
            errorMessage = (
                <div className="error_label">
                    {formdata.validationMessage}
                </div>
            )
        }
        return errorMessage;
    }
    const renderTemplate = () => {
        let formTemplate = null;

        switch (formdata.element) {
            case ('input'):
                formTemplate = ( //return some jsx
                    <div className="formBlock">
                        <input
                            {...formdata.config}
                            value={formdata.value}
                            onBlur={(event) => change({ event, id, blur: true })}
                            //blur is true when user get outside the field,
                            //or wrote some information and after this he gets outside the field
                            onChange={(event) => change({ event, id })}
                        />
                        {showError()}

                    </div >
                )
                break;
            default:
                formTemplate = null;

        }
        return formTemplate;
    }
    return (
        <div>
            {renderTemplate()}
        </div>
    );
};

export default Formfield;