import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Progress, Upload, Modal, Alert, Icon, Spin } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import FileUploadProgress  from 'react-fileupload-progress';


const FormItem = Form.Item
const styles = {
  bslabel: {
    display: 'inline-block',
    maxWidth: '100%',
    marginBottom: '5px',
    fontWeight: 700
  },

  bsHelp: {
    display: 'block',
    marginTop: '5px',
    marginBottom: '10px',
    color: '#737373'
  },

  uploadBtnWrapper: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    marginBottom: '15px', 
    marginLeft:'13%'
  },
  
  btn: {
    border: '2px solid gray',
    color: 'gray',
    backgroundColor: 'white',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  
  bsButton: {
    padding: '1px 5px',
    fontSize: '12px',
    lineHeight: '1.5',
    borderRadius: '3px',
    color: '#fff',
    backgroundColor: '#337ab7',
    borderColor: '#2e6da4',
    padding: '6px 12px',
    marginBottom: 0,
    fontWeight: 400,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    backgroundImage: 'none',
    border: '1px solid transparent',
    display: 'block',
  }
};


@withI18n()
@Form.create()
class UploadModal extends PureComponent {

  handleOk = (file) => {
    const {  onOk, form } = this.props
    const { validateFields } = form
    validateFields(errors => {
      if (errors) {
        return
      }

      onOk(file)
    })
  }

  formGetter(){
    return new FormData(document.getElementById('customForm'));
  }

  customFormRenderer(onSubmit){
    return (
      <form id='customForm' style={styles.uploadBtnWrapper} >
        <input style={styles.btn} type="file" id="uploadField" name='file' id="exampleInputFile" />
        <input  type="hidden" value="users.csv" name='fieldname' id="fieldname" />
        <p style={styles.bsHelp}></p>
        <button type="button" id="uploadButton" style={styles.bsButton} onClick={onSubmit}>Start upload</button>
      </form>
    );
  }


  customProgressRenderer(progress, hasError, cancelHandler) {
    if (hasError || progress > -1 ) {
      let upload = 10;
      let alert = '';
      let statusTxt = "active"
      if(progress ){
          upload = progress;
          if(upload === 100){
            statusTxt = 'success'
            alert = <Alert message="Upload Completed..." type="success" showIcon />
          }
      }
      return (
        <div style={{paddingLeft:10}}>
          {alert}
          <Progress percent={upload} status={statusTxt} />
        </div>
        
      )
    } else {
      return;
    }
  }

  uploadStatus(record){
     let alert = '';
     let count = 0;
     let progress = ''
     const antIcon = <Icon type="loading" style={{ fontSize: 40 }} spin />;
     let spin =  <Spin indicator={antIcon} />
     if(record && record.count === 0){
       return;
     }
     if(record){
       count = record.count
        alert = <Alert message={`Please wait.... Inserting records [${count}] `} type="info" showIcon />

        if(record && record.completed == true){
          alert = <Alert message={`${count} record/s inserted..`} type="success" showIcon />
          progress =  <Progress type="circle" percent={100} format={() => `Done`} />
          spin = ''
        }
     }
     return (
       <div style={{paddingLeft:10}}>
         {alert}
         <div style={{paddingLeft:'34%', paddingTop:20}}>
          {spin}
          {progress}
         </div>
         
       </div>
      
     )
  }

  render() {
    const { item = {}, onOk, form, i18n, loading, record,  ...modalProps } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal {...modalProps} onOk={this.handleOk}
      footer={null}
      >
        <Form layout="horizontal">
          <FormItem >
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <div>
              <FileUploadProgress key='ex2' url='http://localhost:8080/api/v1/users/import'
              onProgress={(e, request, progress) => {this.uploadStatus()}}
              onLoad={ (e, request) => {this.uploadStatus()}}
              onError={ (e, request) => {console.log('error', e, request);}}
              onAbort={ (e, request) => {console.log('abort', e, request);}}
              formGetter={this.formGetter.bind(this)}
              formRenderer={this.customFormRenderer.bind(this)}
              progressRenderer={this.customProgressRenderer.bind(this)}
              />
            </div>

            )}
          </FormItem>
              <div>
                {this.uploadStatus(record)}
              </div>
          
          </Form>
      </Modal>
    )
  }
}

UploadModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UploadModal
