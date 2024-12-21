
import { handleUpdateBlogAction } from '@/actions/blog.action';
import {
    Col,
    Form,
    Input,
    message,
    Modal,
    Row
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const UpdateBlog = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                title: dataUpdate.title,
                author: dataUpdate.author,
                content: dataUpdate.content,
            })
        }
    }, [dataUpdate])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const data = {
                ...values,
                id: dataUpdate.id,
            }

            await handleUpdateBlogAction(data)
            handleCloseUpdateModal();
            message.success("Update blog succeed")
        }
    };

    return (
        <Modal
            title="Update a blog"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
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

export default UpdateBlog;