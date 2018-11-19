/* global document */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Row, Col, DatePicker, Input, AutoComplete,Icon } from 'antd'
import city from 'utils/city'

const { Search } = Input
const { RangePicker } = DatePicker
const Option = AutoComplete.Option;

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

@withI18n()
@Form.create()
class Filter extends PureComponent {
  handleFields = fields => {    
    return fields
  }

  handleSubmit = () => {
    const { onFilterChange, form , onItemSearch} = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields = this.handleFields(fields)
    onItemSearch(fields.search)
  }

  handleReset = () => {
    const { form } = this.props
    const { getFieldsValue, setFieldsValue } = form

    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { form, onFilterChange } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }

  onTextEnters = (key, value) => {
    const {onTextEnter} = this.props;
    if(key.length > 1){
      onTextEnter(key)
    }
  }

  render() {
    const { onAdd, filter, form , names} = this.props
    const { getFieldDecorator } = form
    const { name } = filter

    const renderOption = (item, i) => {
      return (
        <Option key={item.name} id={`result-${i}`} text={item.name}>
          {item.name} 
        </Option>
      );
    }

   

    return (
      <Row gutter={24}>
        
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('search', { initialValue: name })(
            <AutoComplete
            id="searchField"
            className="global-search"
            size="medium"
            style={{ width: '90%' }}
            dataSource={names.map(renderOption)}
            onSelect={this.handleSearch}
            onSearch={this.handleSearch}
            placeholder="Search by name"
            optionLabelProp="text"
            onChange = {this.onTextEnters}
          >
            
          </AutoComplete>
          )}
        </Col>
       
     
        <Col
          {...TwoColProps}
          xl={{ span: 10 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
        >
          <Row type="flex" align="middle" justify="space-between">
            <div>
              <Button
                type="primary"
                className="margin-right"
                onClick={this.handleSubmit}
              >
                <Trans>Search</Trans>
              </Button>
              <Button onClick={this.handleReset}>
                <Trans>Reset</Trans>
              </Button>
            </div>
            <Button type="ghost" onClick={onAdd}>
              <Trans>Upload Users</Trans>
            </Button>
          </Row>
        </Col>
      </Row>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
