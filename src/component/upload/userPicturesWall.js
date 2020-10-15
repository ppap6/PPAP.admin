import React from 'react'
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      previewVisible: false,
      previewImage: this.props.type === 'avatar' ? this.props.user.avatar : this.props.user.bg, 
      previewTitle: '',
      fileList: [
        // {
        //   uid: '-1',
        //   name: 'image.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }
      ],
    }
    
    if(props.type === 'avatar'){
      if(props.user.avatar !== ''){
        this.state.fileList = [
          {
            uid: props.user.id,
            url: props.user.avatar
          }
        ]
      }
    }else{
      if(props.user.bg !== ''){
        this.state.fileList = [
          {
            uid: props.user.id,
            url: props.user.bg
          }
        ]
      }
    }
    
  }

  componentWillReceiveProps(props) {
    if(props.type === 'avatar'){
      if(props.user.avatar !== ''){
        this.setState({
          previewImage: props.user.avatar,
          fileList: [
            {
              uid: props.user.id,
              url: props.user.avatar
            }
          ]
        })
      }
    }else{
      if(props.user.bg !== ''){
        this.setState({
          previewImage: props.user.bg,
          fileList: [
            {
              uid: props.user.id,
              url: props.user.bg
            }
          ]
        })
      }
    }  
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleRemove = () => {
    this.props.removePicture(this.props.type)
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  };

  customUploadPicture = (option) => {
    const formData = new FormData();
    formData.append("files[]", option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = (e) => {
      // console.log(e.target.result);// 打印图片的base64
      this.props.emitBase64(e.target.result, this.props.type)
      if (e && e.target && e.target.result) {
        option.onSuccess();
      }
    };
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove}
          onChange={this.handleChange}
          customRequest={this.customUploadPicture}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall