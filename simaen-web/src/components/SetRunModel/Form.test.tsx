/*
# DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

# This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
# Any opinions,findings, conclusions or recommendations expressed in this material are those
# of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

# (c) 2021 Massachusetts Institute of Technology.

# The software/firmware is provided to you on an As-Is basis

# Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
# or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
# are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
# other than as specifically authorized by the U.S. Government may violate any copyrights that
# exist in this work.

# Copyright (c) 2021 Massachusetts Institute of Technology
# SPDX short identifier: MIT

# Developed as part of: SimAEN, 2021
*/

import { render } from '@testing-library/react';
import { createShallow } from '@material-ui/core/test-utils';
import userEvent from '@testing-library/user-event';

import { defaultForm, values } from '../../constants';
import Form from './Form';
import { act } from 'react-dom/test-utils';
import { FormType } from '../../models';


test('starting cases changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.starting_cases.Label);
    expect(control).toHaveValue(defaultForm.starting_cases.toString());

    userEvent.selectOptions(control, values.starting_cases.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        starting_cases: values.starting_cases.High
    });
});

test('interaction level changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.interaction_level.Label);
    expect(control).toHaveValue(defaultForm.interaction_level);

    userEvent.selectOptions(control, values.interaction_level.High)

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        interaction_level: values.interaction_level.High
    });
});

test('vaccination level changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.p_vaccinated.Label);
    expect(control).toHaveValue(defaultForm.p_vaccinated.toString());

    userEvent.selectOptions(control, values.p_vaccinated.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        p_vaccinated: values.p_vaccinated.High
    });
});

test('masking level changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.p_mask_given_norm.Label);
    expect(control).toHaveValue(defaultForm.p_mask_given_norm.toString());

    userEvent.selectOptions(control, values.p_mask_given_norm.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        p_mask_given_norm: values.p_mask_given_norm.High
    });
});

test('testing delay changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.test_delay.Label);
    expect(control).toHaveValue(defaultForm.test_delay.toString());

    userEvent.selectOptions(control, values.test_delay.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        test_delay: values.test_delay.High
    });
});

test('EN rate changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.p_running_app.Label);
    expect(control).toHaveValue(defaultForm.p_running_app.toString());

    userEvent.selectOptions(control, values.p_running_app.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        p_running_app: values.p_running_app.High
    });
});

test('risk settings changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.risk_settings.Label);
    expect(control).toHaveValue(defaultForm.risk_settings);

    userEvent.selectOptions(control, values.risk_settings.Wide)

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        risk_settings: values.risk_settings.Wide
    });
});

test('quarantine compliance changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.p_maximal_restriction_given_aen_notification.Label);
    expect(control).toHaveValue(defaultForm.p_maximal_restriction_given_aen_notification.toString());

    userEvent.selectOptions(control, values.p_maximal_restriction_given_aen_notification.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        p_maximal_restriction_given_aen_notification: values.p_maximal_restriction_given_aen_notification.High
    });
});

test('requires call changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.key_upload_requires_call.Label);
    expect(control).not.toBeChecked();

    control.click();

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        key_upload_requires_call: true
    });
});

test('contact tracers changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.n_contact_tracers.Label);
    expect(control).toHaveValue(defaultForm.n_contact_tracers.toString());

    userEvent.selectOptions(control, values.n_contact_tracers.Medium.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        n_contact_tracers: values.n_contact_tracers.Medium
    });
});

test('ct compliance changes', () => {
    const setFormMock = jest.fn();
    const container = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    const control = container.getByLabelText(values.p_maximal_restriction_given_ph_call.Label);
    expect(control).toHaveValue(defaultForm.p_maximal_restriction_given_ph_call.toString());

    userEvent.selectOptions(control, values.p_maximal_restriction_given_ph_call.High.toString())

    expect(setFormMock).toHaveBeenCalledWith({
        ...defaultForm,
        p_maximal_restriction_given_ph_call: values.p_maximal_restriction_given_ph_call.High
    });
});

test('subparams visible by default', async () => {
    const setFormMock = jest.fn();
    const {getByText} = render(<Form form={defaultForm} setForm={setFormMock} />);
    
    let subControls = [
        getByText(values.risk_settings.Label),
        getByText(values.p_maximal_restriction_given_aen_notification.Label),
        getByText(values.key_upload_requires_call.Label)
    ]
    
    subControls.forEach((c) => expect(c).toBeVisible())
});

test('subparams hide', async () => {
    const form:FormType = {...defaultForm, p_running_app: values.p_running_app.None}

    const setFormMock = jest.fn();
    const {getByText} = render(<Form form={form} setForm={setFormMock} />);
    
    let subControls = [
        getByText(values.risk_settings.Label),
        getByText(values.p_maximal_restriction_given_aen_notification.Label),
        getByText(values.key_upload_requires_call.Label)
    ]
    
    subControls.forEach((c) => expect(c).not.toBeVisible())
});
