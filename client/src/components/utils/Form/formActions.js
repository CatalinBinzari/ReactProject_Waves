//all the logic
export const validate = (element, formdata = []) => { //check 
    let error = [true, '']

    if (element.validation.email) {
        const valid = /\S+@\S+\.\S+/.test(element.value);
        const message = `${!valid ? "Must be  a valid email" : ""}`;
        error = !valid ? [valid, message] : error;
    }

    if (element.validation.required) { //if required
        //valid = true, only if element.value exists(is not empty), else false
        const valid = element.value.trim() !== '';
        const message = `${!valid ? 'This field is required' : ''}`;
        error = !valid ? [valid, message] : error //if is not valid, err= valid(false) and message(''), else error
    }
    return error

}
export const update = (element, formdata, formName) => {
    const newFormdata = {
        ...formdata
    }
    const newElement = {
        ...newFormdata[element.id]  //just the email
    }

    newElement.value = element.event.target.value; //new element has the new value

    if (element.blur) { // user gets outside the field and we can start validating 
        let validData = validate(newElement, formdata);
        newElement.valid = validData[0]//validData[0] can be true or false, depends if err persists or not
        newElement.validationMessage = validData[1] //err message
    }

    newElement.touched = element.blur;

    //we made all changes inside new element, and we need to put it inside new formdata
    newFormdata[element.id] = newElement; //we have a nea state of formdata
    return newFormdata;
}