'use client';
import { handleCreateUserAction } from '@/actions';
import { handleCreateBlogAction } from '@/actions/blog.action';
import {
    Modal, Input, Form, Row, Col, message
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const CreateBlog = (props: IProps) => {

    const {
        isCreateModalOpen, setIsCreateModalOpen
    } = props;

    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
        const res = await handleCreateBlogAction(values);
        if (res?.id) {
            handleCloseCreateModal();
            message.success("Create succeed!")
        }

    };

    return (
        <Modal
            title="Add new blog"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: 'Please input your title!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                     <Col span={24} md={12}>
                        <Form.Item
                            label="Author"
                            name="author"
                            rules={[{ required: true, message: 'Please input your author!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                     <Col span={24} md={24  }>
                        <Form.Item
                            label="Content"
                            name="content"
                            rules={[{ required: true, message: 'Please input your content!' }]}
                        >
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default CreateBlog;