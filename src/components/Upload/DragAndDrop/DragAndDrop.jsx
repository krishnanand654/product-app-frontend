/* eslint-disable react/prop-types */
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import { useState } from 'react';

const { Dragger } = Upload;

const DragAndDrop = ({ onFileSelect }) => {
    const [fileList, setFileList] = useState([]);

    const props = {
        name: 'file',
        multiple: false,
        fileList,

        beforeUpload: (file) => {
            setFileList([file]);
            onFileSelect(file);
            return false;
        },

        onRemove: (file) => {
            setFileList([]);
            onFileSelect(null);
        },

        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a .jpeg and .png.
            </p>
        </Dragger>
    );
};

export default DragAndDrop;
