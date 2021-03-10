import './styles.scss';

import {useState} from 'react';
import {observer} from 'mobx-react';
import {Form, Input, Button} from 'antd';
import AppActions from "../../actions/AppActions";

function LoginPage (){
    const [submittingForm, setSubmittingForm] = useState(false);
    const [form] = Form.useForm();

    async function onSubmitForm(){
        setSubmittingForm(true);
        let values = form.getFieldsValue();
        if (values){
            const {account, password} = values;
            await AppActions.loginToCrunchyroll(account, password);
        }
        setSubmittingForm(false);
    }

    return(
        <div className='login-page'>
            <Form form={form} onFinish={onSubmitForm} layout='vertical'>
                <Form.Item label='Username/Email' name='account'>
                    <Input size='large'/>
                </Form.Item>
                <Form.Item label='Password' name='password'>
                    <Input size='large'/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' loading={submittingForm}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default observer(LoginPage);